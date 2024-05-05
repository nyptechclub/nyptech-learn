"use server"

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, lessons, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export const upsertChallengeProgress = async(challengeId: number) => {
    const {userId} = await auth()
    if (!userId){
        toast.error("Unauthorized")
        return
    }
    const currentUserProgress = await getUserProgress()
    const userSubcription = await getUserSubscription()
    if (!currentUserProgress){
        toast.error("User Not Found")
        return
    }
    const existchallenge = await db.query.challenges.findFirst({
        where: and(
            eq(challenges.id, challengeId),
        ),
    })
    if (!challenges){
        toast.error("Challenge Not Found")
        return
    }
    const lessonId = challenges.lessonId
    const existingchallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    })
    const isPractice = !!existingchallengeProgress;
    if (currentUserProgress.hearts === 0 
        && !isPractice 
        && !userSubcription?.isActive){
        return {error: "hearts"}
    }
    if (isPractice){
        await db.update(challengeProgress).set({
            completed: true,
        })
        .where(
            eq(challengeProgress.id, existingchallengeProgress.id)
        )
        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 5),
            points: currentUserProgress.points + 10,

        }).where(eq(userProgress.userId, userId))
        revalidatePath("/learn")
        revalidatePath("/lesson")
        revalidatePath("/quests")
        revalidatePath("/leaderboard")
        revalidatePath(`/lesson/${challenges.lessonId}`)
        return
    }
    await db.insert(challengeProgress).values({
        challengeId, userId, completed:true,
    })
    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
    }).where(eq(userProgress.userId, userId))
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
    revalidatePath(`/lesson/${challenges.lessonId}`)
}
