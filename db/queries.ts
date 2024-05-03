import { cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { challengeOptions, challengeProgress, challenges, courses, lessons, units, userProgress } from "./schema";
import { asc, eq } from "drizzle-orm";
export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }
    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with:{
            activeCourse: true,
        }
    })
    return data;
})
export const getUnits = cache(async () => {
    const {userId} = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId){
        return []
    }
    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with:{
            lessons:{
                with: {
                    challenges:{
                        with:{
                            challengeProgress: {
                                where: eq(
                                    challengeProgress.userId,
                                    userId,
                                )
                            }
                            
                        }
                    }
                }
            }
        }
    })
    const normalizedData = data.map((unit) => {
        const lessonswithcompleted = unit.lessons.map((lesson) => {
            if(lesson.challenges.length === 0){
                return {...lesson, completed: false}
            }
            const allcompletedchallenges = lesson.challenges.every((challenges) => {

                return challenges.challengeProgress && challenges.challengeProgress.length > 0 && challenges.challengeProgress.every((progress) => progress.completed)
            })
            return  {...lesson, completed: allcompletedchallenges}
        })
        return { ...unit, lessons: lessonswithcompleted}
    })
    return normalizedData;
})
export const getCourses = cache(async() =>{
    const data = await db.query.courses.findMany();
    return data;
})
export const getCourseById = cache(async  (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
    })
    return data
})

export const getCourseProgress = cache(async () => {
    const {userId} = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId){
        return null
    }
    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy:(units, {asc}) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons:{
                orderBy: (lessons, {asc}) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with:{
                            challengeProgress:{
                                where: eq(challengeProgress.userId, userId)
                            }
                        }
                    }
                }
            }
        }
    })
    const firstUncompleted = unitsInActiveCourse.flatMap((unit)=> unit.lessons).find((lesson)=> {
        return lesson.challenges.some((challenges)=>{
            return !challenges.challengeProgress || challenges.challengeProgress.length === 0 || challenges.challengeProgress.some((progress)=> progress.completed === false)
        })
    })
    return {
        activelesson: firstUncompleted,
        activelessonId: firstUncompleted?.id,
    }
} )
export const getlesson = cache(async (id?:number) => {
    const {userId} = await auth()
    if (!userId){
        return null
    }
    const courseprogress = await getCourseProgress();
    const lessonId = id || courseprogress?.activelessonId
    if (!lessonId){
        return null
    }
    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges:{
                orderBy: (challenges, {asc}) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress:{
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });
    if (!data || !data.challenges){
        return null
    }
    const normalizedChallenge = data.challenges.map((challenges) => {
        const completed = challenges.challengeProgress && challenges.challengeProgress.length > 0 && challenges.challengeProgress.every((progress) => progress.completed)
        return { ...challenges, completed}
    })
    return { ...data, challenges: normalizedChallenge}
});
export const getlessonPercent = cache(async ()=>{
    const courseprogress = await getCourseProgress();
    if(!courseprogress?.activelessonId){
        return 0
    }
    const lesson = await getlesson(courseprogress.activelessonId)
    if (!lesson){
        return 0
    }
    const completechallenges = lesson.challenges.filter((challenges) => challenges.completed)
    const percentage = Math.round((completechallenges.length / lesson.challenges.length) * 100)
    return percentage;
})