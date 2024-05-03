"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course Not Found");
  }
  const existingUserProgress = await getUserProgress();
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
  }
  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });
  revalidatePath("/courses");
  revalidatePath("/learn");
};
export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const currentUserProgress = await getUserProgress();
  const Challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  })
  if (!Challenge){
    throw new Error("Challenge Not Found")
  }
  const lessonId = Challenge.lessonId
  const existingchallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });
  const isPractice = !!existingchallengeProgress;
  if (isPractice) {
    return { error: "practice" };
  }
  if (!currentUserProgress) {
    throw new Error("User Progress Not Found");
  }
  if (currentUserProgress.hearts === 0){
    return {error: "hearts"}
    
  }
  await db.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0),
  }).where(eq(userProgress.userId,  userId))
  revalidatePath("/learn")
  revalidatePath("/leaderboard")
  revalidatePath("/quests")
  revalidatePath("/shop")
  revalidatePath(`/lesson/${lessonId}`)
};
