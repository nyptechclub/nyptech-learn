"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
 disabled: boolean
 courseId: string
 chapterId: string
 isPublished: boolean | null
}
export const ChapterActions = ({
    disabled, courseId, chapterId, isPublished
}: Props) => {
    const [isloading, setisloading] = useState(false)
    const router = useRouter()
    const onpublish = async () =>{
        try{
            setisloading(true)
            if(isPublished){
                await axios.patch(`/api/course/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Chapter unpublished")
            }else{
                await axios.patch(`/api/course/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Chapter published")
            }
            router.refresh()
        }catch(err){
            toast.error("Could not publish")
            console.log(err)
        }finally{
            setisloading(false)
        }
    }
    const onDelete = async()=>{
        try{
            setisloading(true)
            await axios.delete(`/api/course/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter Deleted")
            router.refresh()
            router.push(`/teacher/courses/${courseId}`)
        }catch{
            toast.error("Something went wrong")
        }finally{
            setisloading(false)
        }
    }
    return ( 
        <div className="flex items-center gap-x-2">
            <Button
            onClick={onpublish}
            disabled={disabled || isloading}
            variant="outline"
            size="sm">
                {isPublished ? "Unpublish": "Publish"}
            </Button>
            <ConfirmModal
            onConfirm={onDelete}>
            <Button size="sm" disabled={isloading}>
                <Trash className="size-4"/>
            </Button>
            </ConfirmModal>
            

        </div>
    );
}