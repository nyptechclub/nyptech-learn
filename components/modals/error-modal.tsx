"use client"

import { useExitModal } from "@/store/use-exit-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogContent, DialogTitle} from "../ui/dialog";
import { Button } from "../ui/button";
type Props = {
    error: string
}
const ErrorModal = ({error}: Props) => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = useExitModal();
    useEffect(()=> setIsClient(true), [])
    if(!isClient){
        return null
    }
    return ( 
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                    An error occured!
                    </DialogTitle>
                    <DialogDescription>
                    {error}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gay-y-4 w-full">
                    <Button 
                    variant="destructive" 
                    className="btn w-full" 
                    onClick={() => {close()
                        router.push("/")
                    }}>
                        End Session
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default ErrorModal;