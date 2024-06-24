"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean | null;
};

export const CourseActions = ({ disabled, courseId, isPublished }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/course/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await axios.patch(`/api/course/${courseId}/publish`);
        toast.success("Course published");
      }
      router.refresh();
    } catch (err) {
      toast.error("Could not publish");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/course/${courseId}`);
      toast.success("Course deleted");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onCopyLink = () => {
    const currentLink = window.location.href;
    navigator.clipboard.writeText(currentLink).then(() => {
      toast.success("Link copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onCopyLink}>
        Copy Link
      </Button>
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
