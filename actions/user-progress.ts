"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress, userSubcription } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { POINTS } from "@/constants";
export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    throw new Error("Unauthorized") && redirect("/")
  }
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course Not Found") && redirect("/")
  }
  if (!course.units.length || !course.units[0].lessons.length){
    throw new Error("course is empty") && redirect("/")
  }
  const existingUserProgress = await getUserProgress();
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourse: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }
  await db.insert(userProgress).values({
    userId,
    activeCourse: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });
  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};
export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized") && redirect("/")
  }
  const currentUserProgress = await getUserProgress();
  const subbed = await getUserSubscription()
  const Challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  })
  if (!Challenge){
    throw new Error("Challenge Not Found") && redirect("/")
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
    return { error: "practice" }
  }
  if (!currentUserProgress) {
    throw new Error("User Progress Not Found") && redirect("/")
  }
  if (subbed?.isActive){
    return {error: "subscription"}
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
export const refillHearts = async() => {
  const currentUserProgress = await getUserProgress()
  if (!currentUserProgress){
    throw new Error("User progress not found") && redirect("/")
  }
  if (currentUserProgress.hearts === 5) {
    throw new Error("Hearts are already full") && redirect("/")
  }
  if (currentUserProgress.points < POINTS){
    throw new Error("Not enough points") && redirect("/")
  }
  await db.update(userProgress).set({
    hearts: 5,
    points: currentUserProgress.points - POINTS,
  }).where(eq(userProgress.userId, currentUserProgress.userId))
  revalidatePath("/shop")
  revalidatePath("/learn")
  revalidatePath("/quests")
  revalidatePath("/leaderboard")
}
export const updatetheme = async (values: string) => {
  const currentUserProgress = await getUserProgress()
  if (!currentUserProgress){
    throw new Error("User progress not found") && redirect("/")
  }
  await db.update(userProgress).set({
    theme: values,
  }).where(eq(userProgress.userId, currentUserProgress.userId))
  revalidatePath("/shop")
  revalidatePath("/learn")
  revalidatePath("/quests")
  revalidatePath("/leaderboard")
}
//todo: set price to a variable in db
//add more courses
//add a normal learning module (teach content)
//add more to the story
//all ids in admin.ts
//tell model not login
