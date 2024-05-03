import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import { HeartIcon, InfinityIcon, X } from "lucide-react";

type Props = {
 hearts: number;
 percent: number;
 hasSub: boolean
}
export const Header = ({hearts, percent, hasSub}: Props) => {
    const {open} = useExitModal()

    return ( 
        <div className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
            <X onClick={open} className="btn btn-circle btn-accent btn-sm text-accent"/>
            <Progress value={percent}/>
            <div className="items-center font-bold flex flex-row gap-2">
                <HeartIcon
                className="text-accent btn btn-circle btn-accent btn-sm"/>{
                    hasSub ? <InfinityIcon className="btn btn-circle btn-accent btn-sm text-accent"/> : hearts
                }
            </div>
        </div>
    );
}