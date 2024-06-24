"use server"

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, lessons, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export const upsertChallengeProgressString = async() => {
    const {userId} = await auth()
    if (!userId){
        toast.error("Unauthorized")
        return
    }
    const currentUserProgress = await getUserProgress()
    if (!currentUserProgress){
        toast.error("User Not Found")
        return
    }
    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
    }).where(eq(userProgress.userId, userId))
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
    revalidatePath(`/lesson/${challenges.lessonId}`)
}
