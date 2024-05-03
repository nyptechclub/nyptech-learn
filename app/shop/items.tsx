"use client"

import { refillHearts } from "@/actions/user-progress"
import { createStripeUrl } from "@/actions/user-subscription"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import Image from "next/image"
import { useTransition } from "react"
import { toast } from "sonner"
const POINTS = 500
type Props = {
 hearts: number
 points: number
 hasActiveSubscription: boolean
}
export const Items = ({hearts, points, hasActiveSubscription}: Props) => {
    const [pending, startTransition] = useTransition()
    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS){
            return
        }
        startTransition(() =>{
            refillHearts().catch(() => toast.error("Something went wrong"))
        })
    }
    const onUpgrade = () => {
        startTransition(()=>{
         createStripeUrl().then((response)=> {
            if (response.data) {
                window.location.href = response.data
            }
         }).catch(() => toast.error("Something went wrong"))

        })
    }
    return ( 
        <ul className="w-full">
           <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
            <div className="flex flex-row flex-wrap m-5 gap-4 ">
            <div className="card-body shadow-xl rounded-xl bg-accent text-bold text-xl">
                    Current Points: {points} <br>
                    </br>
                    Current Hearts: {hearts}
                </div>
                <div className="card-body shadow-xl rounded-xl bg-accent">
                    Refill Hearts:
                <Button
            disabled={hearts === 5 || points < POINTS} className="btn"
            onClick={onRefillHearts}>
                {hearts === 5 ? "FULL" : (
                    <div className="flex items-center">
                        <Coins/>{POINTS}
                    </div>
                )}
            </Button>
                </div>
                <div className="card-body shadow-xl rounded-xl bg-accent items-center">
                <Image
                    src="/unlimited.svg"
                    alt="unlimited"
                    height={60}
                    width={60}
                    />
                Unlimited Hearts:
                <Button
                onClick={onUpgrade} disabled={pending || hasActiveSubscription}>
                    {hasActiveSubscription? "settings" : "upgrade"}
            </Button>
                </div>
            </div>

            </div> 
        </ul>
    );
}