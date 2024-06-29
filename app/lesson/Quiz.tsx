"use client"

import { challengeOptions, challenges, lessons, userSubcription } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { ChallengeOptionType } from "./ChallengeOptions";
import { Footer } from "./Footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner"
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useMount, useWindowSize } from "react-use";
import { Coins, Heart, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti"
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import Link from "next/link";
type Props = {
    lsnId: number;
    lsnChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[]
    })[]
    hearts: number;
    percent: number;
    userSubbed: typeof userSubcription.$inferSelect & {
        isActive: boolean
    } | null ;
}

export const Quiz = ({ lsnChallenges, lsnId, hearts, percent, userSubbed }: Props) => {

    const {open: openHeartsModal} = useHeartsModal()
    const {open: openPracticeModal} = usePracticeModal()
    useMount(()=>{
        if (percent === 100){
            openPracticeModal()
        }   
    })
    const { width, height } = useWindowSize()
    const router = useRouter()
    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true })
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.wav" })
    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/incorrect.wav" })
    const [pending, startTransition] = useTransition()
    const [userlessonId] = useState(lsnId)
    const [userhearts, setHearts] = useState(hearts)
    const [userpercent, setPercent] = useState(() =>{
        return percent === 100 ? 0 : percent
    })    
    const [challenges] = useState(lsnChallenges)
    const [activeIndex, setActiveIndex] = useState(() => {
        const umcompletedIndex = challenges.findIndex((challenges) => !challenges.completed)
        return umcompletedIndex === -1 ? 0 : umcompletedIndex
    })
    const [selectedOption, setSelectedOption] = useState<number>()
    const [status, setstatus] = useState<"correct" | "wrong" | "none">("none")

    const challenge = challenges[activeIndex]
    const options = challenge?.challengeOptions ?? []
    const onNext = () => {
        setActiveIndex((current) => current + 1)
    }
    const onSelect = (id: number) => {
        if (status !== "none") return
        setSelectedOption(id)
    }
    const onContinue = () => {
        if (!selectedOption) return
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
        if (!correctOption) {
            return
        }
        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id).then((response) => {
                    if (response?.error === "hearts") {
                        openHeartsModal()
                        return
                    }
                    correctControls.play()
                    setstatus("correct")
                    setPercent((prev) => prev + 100 / challenges.length)
                    if (userpercent === 100) {
                        setHearts((prev) => Math.min(prev + 1, 5))
                    }
                })
                    .catch(() => toast.error("Someting went wrong, please try again"))
            })
        } else {
            startTransition(() => {
                reduceHearts(challenge.id).then((response) => {
                    if (response?.error === "hearts") {
                        openHeartsModal()
                        return;
                    }
                    incorrectControls.play()
                    setstatus("wrong")
                    if (!response?.error) {
                        setHearts((prev) => Math.max(prev - 1, 0))
                    }
                })
                    .catch(() => toast.error("Something when wrong please try again."))
            })
        }
    }
    if (!challenge) {
        return (
            <div className="min-h-screen">
            {finishAudio}
                <Confetti
                    recycle={false}
                    height={height}
                    width={width}
                    numberOfPieces={500}
                    tweenDuration={10000} />
                <div className="hero ">

                    <div className="hero-content text-2xl font-bold text-center items-center flex-col flex">
                        <img src="/finish.svg"></img>
                        <div>
                            Challenge Completed!
                        </div>
                        <div className="text-base">
                            You did it!
                        </div>
                        <img src="/chestopen.png"/>

                        <div className="flex flex-row gap-4">
                            <Button variant={"gooeyRight"} className="btn btn-success">
                                Challenges Completed {challenges.length} <Trophy />
                            </Button>
                            <Button variant={"gooeyRight"} className="btn btn-error">
                                Hearts Left: {hearts} <Heart />
                            </Button>
                        </div>
                    </div>

                </div>
                <Footer
                    lessonId={userlessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </div>
        )
    }
    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question
    return (
        <>
            {incorrectAudio}
            {correctAudio}
            <Header
                hearts={userhearts}
                percent={userpercent}
                hasSub={!!userSubbed?.isActive}
            />
            <div className="card text-center items-center">
                <div className="card-body">
                {challenge && challenge.lesson && 
  <Link href={challenge.lesson}>
    <Button className="btn">Go to lesson</Button>
  </Link>
}


                    <h1 className="card-title ">
                        {title}
                    </h1>
                    <div className="card-actions flex-col">
                        {
                            challenge.type != "SELECT" && (
                                <div className="chat chat-start">
                                    <div className="chat-image avatar">
                                        <div className="w-10 mask mask-squircle">
                                            <img src="/wizard.png" />
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
                            disabled={pending}
                            type={challenge.type}
                        />

                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    );
}