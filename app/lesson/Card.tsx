import { cn } from "@/lib/utils"
import { challenges } from "@prisma/client"
import { useCallback } from "react"
import { useAudio, useKey } from  "react-use"
type Props = {
    id: number
    text: string
    imageSrc: string | null
    shortcut: string
    selected?: boolean
    onClick: () => void
    status?: "correct" | "wrong" | "none"
    audioSrc: string | null
    disabled?:boolean
    type: challenges["type"]
}
export const Card = ({
    id,
    text,
    imageSrc,
    shortcut,
    selected,
    onClick,
    status,
    audioSrc,
    disabled,
    type}: Props) => {
        const [audio, _, controls] = useAudio({ src: audioSrc || "" })
        const handleclick = useCallback(()=>{
            if (disabled) return;
            controls.play();
            onClick();
        },[disabled, onClick, controls])
        useKey(shortcut, handleclick, {}, [handleclick])
    return ( 
        <div 
        onClick={handleclick} 
        className={cn("h-full border-2 rounded-xl border-b-4 hover:bg-base/5 p-4 lg:p-6 cursor-pointer active:border-b-2", 
        selected && "border-base-300 bg-base-100", selected && status === "correct" && "border-green-300 bg-green-100 hover:bg-green-100",
        selected && status === "wrong" && "border-rose-300 bg-rose-100 hover:bg-rose-100",
        disabled && "pointer-events-none hover:bg-base",
        type === "ASSIST" && "lg:p-3 w-full"
        )} >
            {audio}
            {imageSrc && (
                <figure><img src={imageSrc} alt={text} /></figure>
            ) }
            <div className={cn("flex items-center justify-between", type === "ASSIST" && "flex-row-reverse")}>
                {type === "ASSIST" && <div/>}
                <p className={cn(
                    "lg:text-base text-sm", selected && "text-base-content", selected && status === "correct" && "text-green-500", selected && status === "wrong" && "text-rose-500"
                )}>
                    {text}
                </p>
                <div className={cn("flex items-center justify-between", type === "ASSIST" && "flex-row-reverse")}>
                {type === "ASSIST" && <div/>}
                <div className={cn(
                    "btn mt-5", selected && "text-base-content", selected && status === "correct" && "text-green-500", selected && status === "wrong" && "text-rose-500")}>
                    {shortcut}
                </div>
                </div>
            </div>
        </div>
    );
}