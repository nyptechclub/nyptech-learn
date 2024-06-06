"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cCourses, chapters } from "@/db/schema"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import ChapterList from "./chapterlist"

const formSchema = z.object({
    title: z.string().min(1,{
        message: "Title is required"
    })
})
interface Props{
    initialData: typeof cCourses & {
        chapters: typeof chapters[]
    }
    courseId: string
}
const Chapters = ({initialData, courseId}:Props) => {
    const [isCreating, setisCreating] = useState(false)
    const [isUpdateing, setisUpdateing] = useState(false)
    const toggleCreating = () => {setisCreating((current) => !current)}
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })
    const router = useRouter()
    const {isSubmitting, isValid} = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post(`/api/course/${courseId}/chapters`, values)
            toast.success("Chapter Created")
            toggleCreating()
            router.refresh()
        }catch{
            toast.error("Error adding chapter, please try again.")
        }
    }
    return ( 
        <div className="mt-6 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Chapters
                <Button variant="ghost" onClick={toggleCreating}>
                {isCreating ? (
                    <div>
                    Cancel
                    </div>):(<>
                        <PlusCircle className="size-4 mr-2"/>
                        Add a chapter
                    </>)}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({field})=> (
                            <FormItem>
                            <FormControl>
                            <Input
                            disabled={isSubmitting}
                            placeholder="Like the chapters of a book"{
                                ...field
                            }/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                        )}/>
                        <Button
                        disabled={!isValid || isSubmitting}
                        type="submit">
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating &&(
                <div className={cn("text-sm mt-2",
                    !initialData.chapters.length && "italic"
                )}>
                    {!initialData.chapters.length && "No Chapters"}
                    {/* <ChapterList
                    onEdit={() => {}}
                    onReorder={()=> {}}
                    items={initialData.chapters || []}
                    /> */}
                </div>
            )}
            {!isCreating && (
                <p className="text-xs mt-4">
                    Drag and drop to reorder chapters
                </p>

            )}
        </div>
     );
}
 
export default Chapters;