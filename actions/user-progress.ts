"use server";

import { POINTS } from "@/constants";
import { getCourseById, getUserProgress, getUserSubscription } from "@/db/queries";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error("Course is empty");
  }

  const existingUserProgress = await getUserProgress();
  if (existingUserProgress) {
    await db.user_progress.update({
      where: { user_id: userId },
      data: {
        active_course_id: courseId,
        user_name: user.firstName || "User",
        user_image_src: user.imageUrl || "/mascot.svg",
      },
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  } else {
    await db.user_progress.create({
      data: {
        user_id: userId,
        active_course_id: courseId,
        user_name: user.firstName || "User",
        user_image_src: user.imageUrl || "/mascot.svg",
      },
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }
};
export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  const subbed = await getUserSubscription();

  const challenge = await db.challenges.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) {
    throw new Error("Challenge Not Found");
  }

  const lessonId = challenge.lesson_id;

  const existingChallengeProgress = await db.challenge_progress.findFirst({
    where: {
      user_id: userId,
      challenge_id: challengeId,
    },
  });

  const isPractice = !!existingChallengeProgress;
  if (isPractice) {
    return { error: "practice" };
  }

  if (!currentUserProgress) {
    throw new Error("User Progress Not Found");
  }

  if (subbed?.isActive) {
    return { error: "subscription" };
  }

  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  await db.user_progress.update({
    where: { user_id: userId },
    data: {
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    },
  });

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");
  revalidatePath("/shop");
  revalidatePath(`/lesson/${lessonId}`);
};
export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error("Hearts are already full");
  }

  if (currentUserProgress.points < POINTS) {
    throw new Error("Not enough points");
  }

  await db.user_progress.update({
    where: { user_id: currentUserProgress.userId },
    data: {
      hearts: 5,
      points: currentUserProgress.points - POINTS,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const updateTheme = async (values: string) => {
  const currentUserProgress = await getUserProgress();
  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  await db.user_progress.update({
    where: { user_id: currentUserProgress.userId },
    data: {
      theme: values,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};