import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/general/icon-badge";
import ChapterTitleForm from "./titleform";
import ChapterDescriptionForm from "./descriptionform";
import VideoForm from "./video";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./ChapterActions";
import { db } from "@/lib/db";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapters.findFirst({
    where: {
      id: params.chapterId,
      course_id: params.courseId,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.video_url,
  ];
  const total = requiredFields.length;
  const completed = requiredFields.filter(Boolean).length;
  const completionText = `(${completed}/${total})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.is_published && (
        <Banner
          variant="warning"
          label="This chapter is not published"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center mb-6"
            >
              <ArrowLeft />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Chapter Creation
                </h1>
                <span className="text-sm">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.is_published}
              />
            </div>
          </div>
        </div>
        <div className="gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your chapter
                </h2>
              </div>
              <ChapterTitleForm
                initialData={{
                  title: chapter.title ?? "",
                }}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={{
                  description: chapter.description ?? "",
                }}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">
                  Add a video
                </h2>
              </div>
            </div>
            <VideoForm
              chapterId={params.chapterId}
              courseId={params.courseId}
              initialData={{
                videoUrl: chapter.video_url ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
