import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
    title: string;
    id: number;
    imageSrc: string;
    onClick: (id: number) => void;
    disabled?: boolean;
    active?: boolean;
}
export const Card = ({ title, id, imageSrc, onClick, disabled, active }: Props) => {
    return (
        <div
            onClick={() => onClick(id)}
            className={cn("h-full border-2 rounded-xl border-b-4 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[180px] max-w-[200]", disabled && "pointer-events-none opacity-50")}>
            <div className="min-[24px] w-full flex items-center justify-end">
                {active && (
                    <div className="rounded-md flex items-center justify-center p-1.5 bg-accent-foreground">
                        <Check className="h-4 w-4 text-accent" />
                    </div>
                )}
            </div>
            <Image
            src={imageSrc}
            alt={title}
            height={70}
            width={93.33}
            className="rounded-lg drop-shadow-md border object cover"
            />
            <p className="text-center font-bold mt-3">
                {title}
            </p>
        </div>
    );
}