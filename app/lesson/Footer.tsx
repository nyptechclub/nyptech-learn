import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useMedia, useKey } from "react-use"
type Props = {
    onCheck: () => void
    status: "correct" | "wrong" | "none" | "completed";
    disabled?: boolean
    lessonId?: number
}
export const Footer = ({ onCheck, status, disabled, lessonId
}: Props) => {
    useKey("Enter", onCheck, {}, [onCheck])
    const isMobile = useMedia("(max-width: 1024px)")
    return (
        <footer className={cn(
            "lg:-h[140px] h-[100px] border-t-2",
            status === "correct" && "border-transparent bg-green-100",
            status === "wrong" && "border-transparent bg-rose-100"
        )}>
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {status === "correct" && (
                    <div className="text-green-500 font-bold lg:text-2xl text-base flex items-center">
                        <CheckCircle />
                        Well Done!
                    </div>
                )}
                {status === "wrong" && (
                    <div className="text-rose-500 font-bold lg:text-2xl text-base flex items-center">
                        <XCircle />
                        Try Again.
                    </div>
                )}
                {status === "completed" && (
                    <Button 
                    variant="default"
                    onClick={() => window.location.href = `/lesson/${lessonId}`}>
                        Practice Again.
                    </Button>
                )}
                <Button
                    disabled={disabled}
                    className="ml-auto btn-accent"
                    onClick={onCheck}
                    size={isMobile ? "sm" : "lg"}
                    variant={status === "wrong" ? "destructive" : "secondary"}>
                    {status === "none" && "Check"}
                    {status === "correct" && "Next"}{status === "wrong" && "Retry"}{status === "completed" && "Continue"}
                </Button>
            </div>

        </footer>
    );
}