"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowBigDown, Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

type Props = {
    id: number;
    index: number;
    total: number;
    locked?: boolean;
    current?: boolean;
    percent: number;
}
export const LessonButton = ({ id, index, total, locked, current, percent }: Props) => {
    const isFirst = index === 0;
    const isLast = index === total;
    const isCompleted = !current && !locked
    const Icon = isCompleted ? Check : isLast ? Crown : Star;
    const href = isCompleted ? `/lesson/${id}` : "/lesson"
    return (
        <Link href={href} aria-disabled={locked} style={{ pointerEvents: locked ? "none" : "auto" }}>
            <div className="relative">
                {current ? (<div className="h-[102px] w-[102px] relative m-5">
                    <div className="animate-bounce btn btn-outline">
                        Start
                        <ArrowBigDown />
                    </div>
                    <CircularProgressbarWithChildren
                        value={Number.isNaN(percent) ? 0 : percent}
                        styles={{
                            path: {
                                stroke: "#4ade80"
                            },
                            trail: {
                                stroke: "#e5e7eb"
                            }
                        }}>
                        <Button variant={locked ? "locked" : "secondary"} className="btn-circle btn-lg drop-shadow-md border-b-4 cursor-pointer active:border-b-2">
                            <Icon className={cn(locked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-primary-foreground text-primary", isCompleted && "fill-none stroke-[4]")} />
                        </Button>
                    </CircularProgressbarWithChildren>
                </div>) : (
                    <Button variant={locked ? "locked" : "secondary"} className="btn-circle btn-lg drop-shadow-md border-b-4 cursor-pointer active:border-b-2">
                        <Icon className={cn(locked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-primary-foreground text-primary", isCompleted && "fill-none stroke-[4]")} />
                    </Button>
                )}
            </div>
        </Link>
    );
}