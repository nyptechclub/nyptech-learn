import { getLesson, getUserProgress, getUserSubscription } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../Quiz";

type Props = {
    params: {
        lessonId: string; // Updated to string since route params are strings by default
    };
};

const LessonIDPage = async ({ params }: Props) => {
    const lessonId = Number(params.lessonId); // Convert to a number

    if (isNaN(lessonId)) {
        redirect("/learn"); // Redirect if the conversion fails
    }

    const lessonData = getLesson(lessonId);
    const userProgress = getUserProgress();
    const subbedData = getUserSubscription();

    const [lesson, progress, subbed] = await Promise.all([
        lessonData,
        userProgress,
        subbedData,
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
