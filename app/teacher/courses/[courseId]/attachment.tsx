//@ts-nocheck
"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { attachments } from "@prisma/client";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    url: z.string().min(1, {
        message: "Image is required",
    }),
});

interface Props {
    initialData: {
        imageSrc: string;
        attachments: attachments[]
    };
    courseId: string;
}

const Attachment = ({ initialData, courseId }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [DeletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter();
    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/course/${courseId}/attachments`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Error adding image, please try again.");
        }
    };
    const onDelete = async (id: string)=>{
        try{
            setDeletingId(id)
            await axios.delete(`/api/course/${courseId}/attachments/${id}`)
            toast.success("Attachment Deleted")
            router.refresh()
        }catch{
            toast.error("Error Deleting attachment")
        }finally{
            setDeletingId(null)
        }
    }
    return (
        <div className="mt-6 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <div>Cancel</div>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id.toString()}
                                    className="flex items-center p-3 w-full border rounded-md shadow-md">
                                    <File className="size-4 mr-2 flex-shrink-0"/>
                                    <Link className="text-xs line-clamp-1 link" href={attachment.url?.toString()}>
                                        {attachment.name?.toString()}
                                    </Link>
                                    {DeletingId === attachment.id.toString() && (
                                        <div>
                                            <Loader2 className="size-4 animate-spin"/>
                                        </div>
                                    )}
                                    {DeletingId !== attachment.id.toString() && (
                                        <Button
                                        onClick={()=> onDelete(attachment.id.toString())} className="ml-auto hover:opacity-75 transition">
                                            <X className="size-4"/>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs mt-4">
                        Add supplementary materials
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attachment;
