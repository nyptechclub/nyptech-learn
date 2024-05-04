import { getUserProgress, getUserSubscription, getlesson } from "@/db/queries";
import { challenges } from "@/db/schema";
import { redirect } from "next/navigation";
import { Quiz } from "./Quiz";

const LessonPage = async() => {
    const lessonData = getlesson()
    const userProgress = getUserProgress()
    const usersubData = getUserSubscription()
    const [
        lesson,
        progress,
        subbed
    ] = await Promise.all([
        lessonData, userProgress, usersubData

    ])
    if (!lesson || !progress){
        redirect("/learn")
    }
    const initalPecent = lesson.challenges.filter((challenges) => challenges.completed).length / lesson.challenges.length * 100
    return ( 
<Quiz
lsnChallenges={lesson.challenges}
lsnId={lesson.id}
hearts={progress.hearts}
percent={initalPecent}
userSubbed={subbed}
/>
     );
}
 
export default LessonPage;