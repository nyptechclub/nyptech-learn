"use server"

import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, lessons, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const upsertChallengeProgress = async(challengeId: number) => {
    const {userId} = await auth()
    if (!userId){
        throw new Error("Unauthorized")
    }
    const currentUserProgress = await getUserProgress()
    if (!currentUserProgress){
        throw new Error ("User Not Found")
    }
    const existchallenge = await db.query.challenges.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    })
    const isPractice = !!existchallenge
    if (currentUserProgress.hearts === 0 && !isPractice){
        return {error: "hearts"}
    }
    if (isPractice){
        await db.update(challengeProgress).set({
            completed: true,
        })
        .where(
            eq(challengeProgress.id, existchallenge.id)
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
    revalidatePath("/lesson")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
    revalidatePath(`/lesson/${challenges.lessonId}`)
}
 
export default upsertChallengeProgress;