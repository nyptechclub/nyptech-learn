import Promo from "@/components/general/promo";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { Sword } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

const QuestPage = async () => {
    const userProgressData = getUserProgress()
    const useSubcriptionData = getUserSubscription()
    const [userProgress, userSubcription] = await Promise.all([
        userProgressData, useSubcriptionData,
    ])
    if (!userProgress || !userProgress.activeCourse) {
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
        </div><ul className="w-full">
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
        {!userSubcription?.isActive && (<Promo />
        )}
    </div>

    );
}

export default QuestPage;