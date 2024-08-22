import { getLesson, getUserProgress, getUserSubscription } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../Quiz";

type Props = {
    params: {
        lessonId: number;
    };
};

const LessonIDPage = async ({ params }: Props) => {
    const lessonData = getLesson(params.lessonId);
    const userProgress = getUserProgress();
    const subbedData = getUserSubscription();

    const [lesson, progress, subbed] = await Promise.all([
        lessonData, userProgress, subbedData,
    ]);

    if (!lesson || !progress) {
        redirect("/learn");
    }

    // Map the data to match the expected type structure
    const mappedChallenges = lesson.challenges.map((challenge) => ({
        ...challenge,
        challengeOptions: challenge.challenge_options, // Rename challenge_options to challengeOptions
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

export default LessonIDPage;
