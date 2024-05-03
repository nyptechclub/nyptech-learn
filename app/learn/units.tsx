import { units, lessons } from "@/db/schema";
import { Notebook } from "lucide-react";
import Link from "next/link";
import { LessonButton } from "./LessonButton";

type Props = {
 id: number;
 order: number;
 title: string;
 description: string;
 activeLessonPercent: number;
 activeLesson: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
 } | undefined;
 lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
 })[];
}
export const Units = ({order, title, description, activeLesson, activeLessonPercent, lessons, id}: Props) => {
    return (<>
        <div className="card bg-accent-foreground">
            <div className="card-body text-accent">
                <h2 className="card-title">
                    {title}
                </h2>
                <p className="">
                    {description}
                </p>
            </div>
            <div className="card-actions m-5">
            <Link href="/lesson" className="btn btn-accent"><Notebook className="text-accent"/>Continue</Link>
            </div>

        </div>
        <div className="flex flex-col items-center gap-10 m-5">
            {lessons.map((lesson, index) => {
                const isCurrent = lesson.id === activeLesson?.id;
                const isLocked = !lesson.completed && !isCurrent;
                return (
                   <LessonButton
                   key={lesson.id}
                   id={lesson.id}
                   index={index}
                   total={lessons.length -1}
                   current={isCurrent}
                   locked={isLocked}
                   percent={activeLessonPercent}

                   /> 
                )
            })}    
            </div>
        </>
    );
}