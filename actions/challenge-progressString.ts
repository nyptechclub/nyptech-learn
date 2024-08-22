"use server";

import { getUserProgress } from "@/lib/queries";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export const upsertChallengeProgressString = async () => {
    const { userId } = await auth();
    if (!userId) {
        toast.error("Unauthorized");
        return;
    }

    const currentUserProgress = await getUserProgress();
    if (!currentUserProgress) {
        toast.error("User Not Found");
        return;
    }

    await db.user_progress.update({
        where: { user_id: userId },
        data: {
            points: currentUserProgress.points + 10,
        },
    });

    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${currentUserProgress.active_course_id}`);
};
