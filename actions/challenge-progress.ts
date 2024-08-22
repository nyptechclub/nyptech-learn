"use server"

import { getUserProgress, getUserSubscription } from "@/lib/queries";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export const upsertChallengeProgress = async (challengeId: number) => {
    const { userId } = await auth();
    if (!userId) {
        toast.error("Unauthorized");
        return;
    }

    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();

    if (!currentUserProgress) {
        toast.error("User Not Found");
        return;
    }

    const existingChallenge = await db.challenges.findUnique({
        where: { id: challengeId },
    });

    if (!existingChallenge) {
        toast.error("Challenge Not Found");
        return;
    }

    const lessonId = existingChallenge.lesson_id;

    const existingChallengeProgress = await db.challenge_progress.findFirst({
        where: {
            user_id: userId,
            challenge_id: challengeId,
        },
    });

    const isPractice = !!existingChallengeProgress;

    if (currentUserProgress.hearts === 0 && !isPractice && !userSubscription?.isActive) {
        return { error: "hearts" };
    }

    if (isPractice) {
        await db.challenge_progress.update({
            where: { id: existingChallengeProgress.id },
            data: { completed: true },
        });

        await db.user_progress.update({
            where: { user_id: userId },
            data: {
                hearts: Math.min(currentUserProgress.hearts + 1, 5),
                points: currentUserProgress.points + 10,
            },
        });

        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonId}`);
        return;
    }

    await db.challenge_progress.create({
        data: {
            challenge_id:challengeId,
            user_id: userId,
            completed: true,
        },
    });

    await db.user_progress.update({
        where: { user_id: userId },
        data: {
            points: currentUserProgress.points + 10,
        },
    });

    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};
