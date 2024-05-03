"use client"

import { challengeOptions, challenges } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { ChallengeOptionType } from "./ChallengeOptions";
import { Footer } from "./Footer";
import upsertChallengeProgress from "@/actions/challenge-progress";
import { toast } from "sonner"

type Props = {
    lsnId: number;
    lsnChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[]
    })[]
    hearts: number;
    percent: number;
    userSubbed: any;
}
export const Quiz = ({ lsnChallenges, lsnId, hearts, percent, userSubbed }: Props) => {
    const [pending, startTransition] = useTransition()
    const [userhearts, setHearts] = useState(hearts)
    const [userpercent, setPercent] = useState(percent)
    const [challenges] = useState(lsnChallenges)
    const [activeIndex, setActiveIndex] = useState(() => {
        const umcompletedIndex = challenges.findIndex((challenges) => !challenges.completed)
        return umcompletedIndex === -1 ? 0 : umcompletedIndex
    })
    const [selectedOption, setSelectedOption] = useState<number>()    
    const [status, setstatus] = useState<"correct" | "wrong" | "none" >("none")

    const challenge = challenges[activeIndex]
    const options = challenge?.challengeOptions ?? []
    const onNext = () => {
        setActiveIndex((current)=> current + 1)
    }
    const onSelect = (id: number) =>{
        if (status !== "none") return
        setSelectedOption(id)
    }
    const onContinue = () => {
        if(!selectedOption) return
        if (status === "wrong") {
            setstatus("none")
            setSelectedOption(undefined)
            return
        }
        if (status === "correct") {
            onNext()
            setstatus("none")
            setSelectedOption(undefined)
            return
        }
        const correctOption = options.find((option) => option.correct)
        if (!correctOption){
            return
        }
        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() =>{
                upsertChallengeProgress(challenge.id).then((response)=>{
                    if(response?.error === "hearts"){
                        return
                    }
                    setstatus("correct")
                    setPercent((prev) => prev + 100 / challenges.length)
                    if (userpercent === 100){
                        setHearts((prev) => Math.min(prev + 1, 5))
                    }
                })
                .catch(()=> toast.error("Someting went wrong, please try agian"))
            })
        } else {

        }
    }
    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question
    return (
        <>
            <Header
                hearts={userhearts}
                percent={userpercent}
                hasSub={!!userSubbed?.isActive}
            />
            <div className="card text-center items-center">
                <div className="card-body">
                    <h1 className="card-title ">
                        {title}
                    </h1>
                    <div className="card-actions flex-col">
                        {
                            challenge.type != "SELECT" && (
                                <div className="chat chat-start">
                                    <div className="chat-image avatar">
                                        <div className="w-10 mask mask-squircle">
                                            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                        </div>
                                    </div>
                                    <div className="chat-bubble chat-bubble-primary">
                                        {challenge.question}
                                    </div>

                                </div>

                            )
                        }
                        <ChallengeOptionType
                            options={options}
                            onSelect={onSelect}
                            status={status}
                            selectedOption={selectedOption}
                            disabled={false}
                            type={challenge.type}
                        />
                    </div>
                </div>
            </div>
            <Footer
            disabled={!selectedOption}
            status={status}
            onCheck={onContinue}
            />
        </>
    );
}