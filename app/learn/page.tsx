import { Feedwrapper } from "@/components/general/feed-wrapper";
import { Header } from "./header";
import Link from "next/link";
import { Coins, HeartPulseIcon, InfinityIcon } from "lucide-react";
import { getCourseProgress, getUnits, getUserProgress, getUserSubscription, getLessonPercent } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Units } from "./units";
import Promo from "@/components/general/promo";
import Quests from "@/components/general/Quests";
import { lessons, units } from "@prisma/client";

const Learn = async () => {
    const userProgressData = getUserProgress();
    const courseProgressData = getCourseProgress();
    const lessonpercentData = getLessonPercent();
    const unitsData = getUnits();
    const subbedData = getUserSubscription()
    const [userProgress, units, courseProgress, lessonpercent, subbed] = await Promise.all([
        userProgressData, unitsData, courseProgressData, lessonpercentData, subbedData
    ])
    if (!userProgress || !userProgress.courses) {
        redirect("/courses")
    }
    if (!courseProgress) {
        redirect("/courses")
    }

    return (
        <section className="min-h-screen">
            <Feedwrapper>
                <div className="drawer drawer-end">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <div className="flex justify-between m-5">
                            <Header title={userProgress.courses.title} />
                            <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Progress</label>
                        </div>
                        
                        {units.map((unit: any) => (
                            <Units
                                key={unit.id}
                                id={unit.id}
                                order={unit.order}
                                description={unit.description}
                                lessons={unit.lessons}
                                title={unit.title}
                                activeLesson={courseProgress.activeLesson as lessons & {
                                    unit: units
                                } | undefined}
                                activeLessonPercent={lessonpercent}
                            />
                        ))}

                    </div>

                    <div className="drawer-side">
                        <label htmlFor="my-drawer-4" className="drawer-overlay" aria-label="close sidebar"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-accent-foreground text-accent z-10">
                            <li className="flex gap-2 flex-row">
                            <img src={userProgress.courses.image_src} className="rounded-lg drop-shadow-md border object cover mb-4 w-20 bg-primary">
                            </img>
                                <Link href="/shop" className="btn btn-outline btn-accent flex items-center gap-2">
                                    {userProgress.points} <Coins className="text-accent"/>
                                </Link>
                                <Link href="/shop" className="btn btn-outline btn-accent flex items-center gap-2">
                                    <HeartPulseIcon className="text-accent"/>
                                    {subbed ? <InfinityIcon className="h-4 w-4 text-accent shrink-0" /> : userProgress.hearts}
                                </Link>

                            </li>
                            {!subbed && (
                            <li><Promo/></li>
                            )}
                            <li>
                                <Quests points={userProgress.points}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </Feedwrapper>
        </section>
    );
};

export default Learn;