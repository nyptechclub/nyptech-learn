"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Editor } from "./editor"
import { init } from "@paralleldrive/cuid2"
import { Preview } from "./preview"

const formSchema = z.object({
    description: z.string().min(1,{
        message: "Description is required"
    })
})
interface Props{
    initialData:{
        description: string
    }
    courseId: string
    chapterId: string
}
const ChapterDescriptionForm = ({
    initialData, 
    courseId,
    chapterId
}:Props) => {
    const [isEditing, setisEditing] = useState(false)
    const toggleEdit = () => setisEditing((current) => !current)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    })
    const router = useRouter()
    const {isSubmitting, isValid} = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/course/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter updated")
            toggleEdit()
            router.refresh()
        }catch{
            toast.error("Error editing course, please try again.")
        }
    }
    return ( 
        <div className="mt-6 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Description
                <Button variant="ghost" onClick={toggleEdit}>
                {isEditing ? (
                    <div>
                    Cancel
                    </div>):(<>
                        <Pencil className="size-4 mr-2"/>
                        Edit Description
                    </>)}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2",
                    !initialData.description && "italic"
                )}>
                    {!initialData.description && "No Description"}
                    {initialData.description && (
                        <Preview
                        value={initialData.description}/>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="description"
                        render={({field})=> (
                            <FormItem>
                            <FormControl>
                            <Editor
                            {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                        )}/>
                        <div className="flex items-center gap-x-2">
                        <Button
                        disabled={!isValid || isSubmitting}
                        type="submit">
                            Save
                        </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
     );
}
 
export default ChapterDescriptionForm;