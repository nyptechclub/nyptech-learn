import { getUserProgress, getUserSubscription, getlesson } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../Quiz";
type Props ={
    params:{
        lessonId: number
    }
}
const LessonIDPage = async({params}: Props) => {
    const lessonData = getlesson(params.lessonId)
    const userProgress = getUserProgress()
    const subbedData = getUserSubscription()
    const [
        lesson,
        progress,
        subbed,
    ] = await Promise.all([
        lessonData, userProgress, subbedData

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
 
export default LessonIDPage;