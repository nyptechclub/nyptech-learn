"use client";

import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress"; // Correct import path

type Props = {
    courses: {
        id: number;
        title: string;
        imageSrc: string;
    }[];
    activeCourse?: number; 
};

export const List = ({ courses, activeCourse }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const onClick = (id: number) => {
        if (pending) return;

        if (id === activeCourse) {
            return router.push("/learn");
        }

        startTransition(() => {
            upsertUserProgress(id);
            router.push("/learn");
        });
    };

    return (
        <div className="pt-6 flex gap-4 flex-wrap items-center">
            {courses.map((course) => (
                <Card
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    imageSrc={course.imageSrc}
                    onClick={onClick}
                    disabled={pending}
                    active={course.id === activeCourse}
                />
            ))}
        </div>
    );
};
