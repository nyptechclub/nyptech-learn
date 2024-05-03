"use client"

import { useHeartsModal } from "@/store/use-hearts-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogContent, DialogTitle} from "../ui/dialog";
import { Button } from "../ui/button";

const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = useHeartsModal();
    useEffect(()=> setIsClient(true), [])
    if(!isClient){
        return null
    }
    return ( 
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                    <img src="/mascot_bad.svg"></img>
                    You ran out of hearts!
                    </DialogTitle>
                    <DialogDescription>
                        Purchase hearts in store.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gay-y-4 w-full">
                    <Button 
                    variant="destructive" 
                    className="btn w-full" 
                    onClick={() => {close()
                        router.push("/shop")
                    }}>
                        End Session
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default HeartsModal;