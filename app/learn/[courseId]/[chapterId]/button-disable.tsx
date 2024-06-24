"use client";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { upsertChallengeProgressString } from "@/actions/challenge-progressString";
import { Preview } from "@/app/teacher/courses/[courseId]/chapters/[chapterId]/preview";
import { Button } from "@/components/ui/button";
import { startTransition, useState } from "react";
import { toast } from "sonner";

type ChapterContentProps = {
  chapter: {
    id: string;
    videoUrl?: string;
    description?: string;
  };
};

const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    setIsDisabled(true);
    console.log(chapter.id);
    toast.success("Congrats!")
    startTransition(() => {
        upsertChallengeProgressString()
    })
    
  };

  return (
    <div className="flex flex-col p-5">
      {chapter.videoUrl ? (
        <video src={chapter.videoUrl} controls />
      ) : (
        <div>No video available</div>
      )}
      <h3 className="p-5">What you will be learning:</h3>
      <Preview value={chapter.description || "No description available"} />
      <Button onClick={handleClick} disabled={isDisabled}>
        Done
      </Button>
    </div>
  );
};

export default ChapterContent;
