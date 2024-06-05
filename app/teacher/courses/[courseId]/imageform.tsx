"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    imageSrc: z.string().min(1, {
        message: "Image is required",
    }),
});

interface Props {
    initialData: {
        imageSrc: string;
    };
    courseId: string;
}

const ImageForm = ({ initialData, courseId }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData.imageSrc);
    const router = useRouter();
    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/course/${courseId}`, values);
            toast.success("Course updated");
            setImageUrl(values.imageSrc); // Update local state with new image URL
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Error adding image, please try again.");
        }
    };

    return (
        <div className="mt-6 border rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <div>Cancel</div>}
                    {!isEditing  && (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !imageUrl ? (
                    <div className="flex items-center justify-center h-60 rounded-md">
                        <ImageIcon className="size-10" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageSrc: url });
                            }
                        }}
                    />
                    <div className="text-xs mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageForm;
