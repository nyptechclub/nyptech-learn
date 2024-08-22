import { Notebook } from "lucide-react";
import Link from "next/link";
import { LessonButton } from "./LessonButton";
import { lessons, units } from "@prisma/client";

type Props = {
    id: number;
    order: number;
    title: string;
    description: string;
    activeLessonPercent: number;
    activeLesson: lessons & {
        unit: units;
    } | undefined;
    lessons: (lessons & {
        completed: boolean;
    })[];
}

export const Units = ({ order, title, description, activeLesson, activeLessonPercent, lessons, id }: Props) => {
    return (
        <>
            <div className="card bg-accent-foreground m-5">
                <div className="card-body text-accent">
                    <h2 className="card-title">
                        {title}
                    </h2>
                    <p>
                        {description}
                    </p>
                </div>
                <div className="card-actions m-5">
                    <Link href={`/lesson/${id}`} className="btn btn-accent">
                        <Notebook className="text-accent" />Continue
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center gap-10 m-5">
                {lessons.map((lesson, index) => {
                    const isCurrent = lesson.id === activeLesson?.id;
                    const isLocked = !lesson.completed && !isCurrent;
                    return (
                        <div className="gap-5 flex flex-col items-center"
                        key={lesson.id}
>
                            <h1>
                            {lesson.title}
                            </h1>
                        <LessonButton
                            id={lesson.id}
                            index={index}
                            total={lessons.length - 1}
                            current={isCurrent}
                            locked={isLocked}
                            percent={activeLessonPercent}
                        />
                        </div>

                    );
                })}
            </div>
        </>
    );
}
