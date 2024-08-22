import Promo from "@/components/general/promo";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/lib/queries";
import { Sword } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

const QuestPage = async () => {
    const userProgressData = getUserProgress()
    const useSubcriptionData = getUserSubscription()
    const [userProgress, userSubcription] = await Promise.all([
        userProgressData, useSubcriptionData,
    ])
    if (!userProgress || !userProgress.active_course_id) {
        redirect("/courses")
    }
    const isPro = !!userSubcription?.isActive
    return (<div className="container m-5 min-h-screen flex-col flex items-center">
        <Image
            src="/quests.svg"
            alt="Quest"
            height={90}
            width={90}
        /><div className="text-3xl font-bold p-5">
            Quests
        </div>
        <div>
            Complete Quest by Earning Points
        </div>
        <div className="m-5 p-5 bg-base-200 rounded-xl">
            Determined, he set off to find more information about the tournament. Along the way, he passed fellow wizards practicing their spells, honing their abilities for the upcoming competition. He marveled at their mastery and felt a twinge of doubt about his own capabilities.
            <br/><br/>
            He arrived at the grand Pixeltown Library, a towering structure filled with ancient tomes and magical scrolls. Inside, he found the Head Librarian, an elderly wizard with a long white beard and kind eyes.
            <br/><br/>
            &quot;Excuse me,&quot; he said, bowing respectfully. &quot;I need to know more about the Wizard Tournament. How can I participate?&quot;
            <br/><br/>
            The Head Librarian smiled knowingly. &quot;Ah, another brave soul seeking the path home. The tournament tests not just your magical prowess, but your wisdom, courage, and heart. Train well, learn from those around you, and remember that true power lies within.&quot;
        </div>
        <ul className="w-full">
            {quests.map((quest) => {
                const progres = (userProgress.points / quest.value) * 100
                return (
                    <div key={quest.title}>
                        <div className="divider"></div>
                        <div className="flex flex-row text-bold text-xl text-center">
                            <Sword />
                            <div>
                                {quest.title}
                            </div>
                            <Progress value={progres} />
                        </div>
                    </div>
                )
            })}
        </ul>
        {/* {!userSubcription?.isActive && (<Promo />
        )} todo upgrade*/ }
    </div>

    );
}

export default QuestPage;