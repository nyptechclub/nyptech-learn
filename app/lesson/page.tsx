import { getUserProgress, getUserSubscription, getLesson } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./Quiz";

const LessonPage = async () => {
    const lessonData = getLesson();
    const userProgress = getUserProgress();
    const usersubData = getUserSubscription();
    
    const [lesson, progress, subbed] = await Promise.all([
        lessonData, userProgress, usersubData,
    ]);
    
    if (!lesson || !progress) {
        redirect("/learn");
    }

    // Map the data to match the expected type structure
    const mappedChallenges = lesson.challenges.map((challenge) => ({
        ...challenge,
        challengeOptions: challenge.challenge_options,
    }));

    const initialPercent = (lesson.challenges.filter((ch) => ch.completed).length / lesson.challenges.length) * 100;
    
    return (
        <Quiz
            lsnChallenges={mappedChallenges}
            lsnId={lesson.id}
            hearts={progress.hearts}
            percent={initialPercent}
            userSubbed={subbed}
        />
    );
};

export default LessonPage;
