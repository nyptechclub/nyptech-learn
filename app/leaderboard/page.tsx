import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

const LeaderboardPage = async () => {
    const userProgressData = getUserProgress()
    const useSubcriptionData = getUserSubscription()
    const top50UserData = getTopTenUsers()
    const [userProgress, userSubcription, leaderboard] = await Promise.all([
        userProgressData, useSubcriptionData, top50UserData
    ])
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses")
    }
    const isPro = !!userSubcription?.isActive
    return (<div className="container m-5 min-h-screen flex-col flex items-center">
            <Image
                src="/leaderboard.svg"
                alt="Leaderboard"
                height={90}
                width={90}
            /><div className="text-3xl font-bold p-5">
                Leaderboard
            </div>
            <div>
            See your position to other learners (top 50)
            </div>
            <div className="divider"></div> 
            {leaderboard.map((userProgress, index)=>{
                return(
                    <div key={userProgress.userId}
                    className="btn btn-outline flex flex-row btn-lg">
                    <div>{index + 1}.
                    </div>
                    <div>
                    {userProgress.userName}
                    </div>
                    <div className="avatar">
                    <div className="w-10 rounded-full">
                    <img src={userProgress.userImageSrc} />
                    </div>
                    </div>
                    <div>
                        {userProgress.points}
                    </div>
                    </div>
                )
            })}
        </div>

    );
}

export default LeaderboardPage;