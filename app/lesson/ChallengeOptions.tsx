import { cn } from "@/lib/utils"
import { Card } from "./Card"
import { challenge_options, challenges } from "@prisma/client"

type Props = {
 options: challenge_options[]
 onSelect: (id: number) => void
 status:"correct" | "wrong" | "none"
 selectedOption?: number 
 disabled?: boolean
 type: challenges["type"]

}
export const ChallengeOptionType = ({options, onSelect, selectedOption, type, status, disabled}: Props) => {
    return ( 
        <div className={cn("grid gap-2", type === "ASSIST" && "grid-cols-1", type === "SELECT" && "grid-cols-2 lg:grid-cols[repeat(auto-fit,minmax(0,1fr))]")}>
            {options.map((option,i) =>(
                <Card
                key={option.id}
                id={option.id}
                text={option.text}
                imageSrc={option.image_src}
                shortcut={`${i + 1}`}
                selected={selectedOption === option.id}
                onClick={()=> onSelect(option.id)}
                status={status}
                audioSrc={option.audio_src}
                disabled={disabled}
                type={type}
                />
            ))}
        </div>
    );
}