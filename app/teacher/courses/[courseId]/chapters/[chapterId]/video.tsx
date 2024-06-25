"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    videoUrl: z.string().min(1, {
        message: "Video is required",
    }),
});

interface Props {
    initialData: {
        videoUrl: string;
    };
    courseId: string;
    chapterId: string
}

const VideoForm = ({ initialData, courseId, chapterId }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData.videoUrl);
    const router = useRouter();
    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/course/${courseId}/chapters/${chapterId}`, values);
            toast.success("Course updated");
            setImageUrl(values.videoUrl); // Update local state with new image URL
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Error adding video, please try again.");
        }
    };

    return (
        <div className="mt-6 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Video
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <div>Cancel</div>}
                    {!isEditing  && (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Change Video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !imageUrl ? (
                    <div className="flex items-center justify-center h-60 rounded-md">
                        <Video className="size-10" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <video src={initialData.videoUrl} controls/>
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs mt-4">
                        upload chapter video
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoForm;
