import { Feedwrapper } from "@/components/ui/feed-wrapper";
import { Header } from "./header";
import Link from "next/link";
import { Coins, HeartPulseIcon, InfinityIcon } from "lucide-react";
import { getCourseProgress, getUnits, getUserProgress, getlessonPercent } from "@/db/queries";
import { redirect } from "next/navigation";
import { Units } from "./units";
import { lessons, units as unitsSchema } from "@/db/schema";

type Props = {
    points: number;
    subbed: boolean;
    hearts: number;
    active: {
        imgsrc: string;
        title: string;
    };
};
const Learn = async ({ points, subbed, hearts, active }: Props) => {
    const userProgressData = getUserProgress();
    const courseProgressData = getCourseProgress();
    const lessonpercentData = getlessonPercent();
    const unitsData = getUnits();
    const [userProgress, units, courseProgress, lessonpercent] = await Promise.all([
        userProgressData, unitsData, courseProgressData, lessonpercentData
    ])
    if (!userProgress || !userProgress.activeCourse) {
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
                            <Header title={userProgress.activeCourse.title} />
                            <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Progress</label>
                        </div>

                        {units.map((unit) => (
                            <Units
                                key={unit.id}
                                id={unit.id}
                                order={unit.order}
                                description={unit.description}
                                lessons={unit.lessons}
                                title={unit.title}
                                activeLesson={courseProgress.activelesson as typeof lessons.$inferSelect & {
                                    unit: typeof unitsSchema.$inferSelect
                                } | undefined}
                                activeLessonPercent={lessonpercent}
                            />
                        ))}

                    </div>

                    <div className="drawer-side">
                        <label htmlFor="my-drawer-4" className="drawer-overlay" aria-label="close sidebar"></label>
                        <ul className="menu p-4 w-80 min-h-full bg-accent-foreground text-accent z-10">
                        <li className="avatar"><img src={userProgress.activeCourse.imageSrc} className="rounded-lg drop-shadow-md border object cover mb-4 w-20 bg-primary">
                            </img>
                            </li>
                            <li className="flex gap-2">
                                <Link href="/shop" className="btn btn-outline btn-accent flex items-center gap-2">
                                    {userProgress.points} <Coins className="text-accent"/>
                                </Link>
                                <Link href="/shop" className="btn btn-outline btn-accent flex items-center gap-2">
                                    <HeartPulseIcon className="text-accent"/>
                                    {subbed ? <InfinityIcon className="h-4 w-4 text-accent" /> : userProgress.hearts}
                                </Link>

                            </li>

                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>
            </Feedwrapper>
        </section>
    );
};

export default Learn;
