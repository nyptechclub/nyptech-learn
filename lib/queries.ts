// Queries for quiz
import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";

// Get user progress
export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }
    const data = await db.user_progress.findFirst({
        where: { user_id: userId },
        include: {
            courses: true,
        },
    });
    return data;
});

// Get user information
export const getUser = async () => {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }
    const data = await db.user_progress.findFirst({
        where: { user_id: userId },
        include: {
            courses: true,
        },
    });
    return data;
};

// Get units for the active course
export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.active_course_id) {
        return [];
    }
    const data = await db.units.findMany({
        where: { course_id: userProgress.active_course_id },
        orderBy: { order: 'asc' },
        include: {
            lessons: {
                orderBy: { order: 'asc' },
                include: {
                    challenges: {
                        orderBy: { order: 'asc' },
                        include: {
                            challenge_progress: {
                                where: { user_id: userId },
                            },
                        },
                    },
                },
            },
        },
    });

    const normalizedData = data.map((unit) => {
        const lessonsWithCompleted = unit.lessons.map((lesson) => {
            if (lesson.challenges.length === 0) {
                return { ...lesson, completed: false };
            }
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challenge_progress.length > 0 && challenge.challenge_progress.every((progress) => progress.completed);
            });
            return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompleted };
    });
    return normalizedData;
});

// Get all courses
export const getCourses = cache(async () => {
    const data = await db.courses.findMany();
    return data;
});

// Get course by ID
export const getCourseById = cache(async (courseId: number) => {
    const data = await db.courses.findUnique({
        where: { id: courseId },
        include: {
            units: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                    },
                },
            },
        },
    });
    return data;
});

// Get course progress
export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.active_course_id) {
        return redirect("/");
    }
    const unitsInActiveCourse = await db.units.findMany({
        where: { course_id: userProgress.active_course_id},
        orderBy: { order: 'asc' },
        include: {
            lessons: {
                orderBy: { order: 'asc' },
                include: {
                    units: true,
                    challenges: {
                        include: {
                            challenge_progress: {
                                where: { user_id:userId },
                            },
                        },
                    },
                },
            },
        },
    });

    const firstUncompleted = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lesson) => {
            return lesson.challenges.some((challenge) => {
                return (
                    !challenge.challenge_progress ||
                    challenge.challenge_progress.length === 0 ||
                    challenge.challenge_progress.some((progress) => !progress.completed)
                );
            });
        });

    return {
        activeLesson: firstUncompleted,
        activeLessonId: firstUncompleted?.id,
    };
});

// Get lesson
export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }
    const courseProgress = await getCourseProgress();
    const lessonId = id || courseProgress?.activeLessonId;
    if (!lessonId) {
        return null;
    }
    const data = await db.lessons.findUnique({
        where: { id: lessonId },
        include: {
            challenges: {
                orderBy: { order: 'asc' },
                include: {
                    challenge_options: true,
                    challenge_progress: {
                        where: { user_id: userId },
                    },
                },
            },
        },
    });
    if (!data || !data.challenges) {
        return null;
    }
    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challenge_progress.length > 0 && challenge.challenge_progress.every((progress) => progress.completed);
        return { ...challenge, completed };
    });
    return { ...data, challenges: normalizedChallenges };
});

// Get lesson progress percentage
export const getLessonPercent = cache(async () => {
    const courseProgress = await getCourseProgress();
    if (!courseProgress?.activeLessonId) {
        return 0;
    }
    const lesson = await getLesson(courseProgress.activeLessonId);
    if (!lesson) {
        return 0;
    }
    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
    const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);
    return percentage;
});

// User subscription data
const DAY_IN_MS = 86_400_400;
export const getUserSubscription = cache(async () => {
    const { userId } = await auth();
    if (!userId) return null;
    const data = await db.user_subscription.findUnique({
        where: { user_Id: userId },
    });
    if (!data) return null;
    const isActive = data.stripe_price_id && data.stripe_end.getTime() + DAY_IN_MS > Date.now();
    return {
        ...data,
        isActive: !!isActive,
    };
});

// Get top ten users
export const getTopTenUsers = cache(async () => {
    const data = await db.user_progress.findMany({
        orderBy: {
            points: 'desc',
        },
        take: 50,
        select: {
            user_id: true,
            user_name: true,
            user_image_src: true,
            points: true,
        },
    });
    return data;
});
