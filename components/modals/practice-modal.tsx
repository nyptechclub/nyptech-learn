"use client"

import { usePracticeModal } from "@/store/use-practice-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogContent, DialogTitle} from "../ui/dialog";
import { Button } from "../ui/button";

const PracticeModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = usePracticeModal();
    useEffect(()=> setIsClient(true), [])
    if(!isClient){
        return null
    }
    return ( 
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                    <img src="/heart.svg"></img>
                    Pactice Lesson
                    </DialogTitle>
                    <DialogDescription>
                        Use Practice mode to gain points and hearts.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gay-y-4 w-full">
                    <Button 
                    variant="destructive" 
                    className="btn w-full" 
                    onClick={close}>
                        I understand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default PracticeModal;