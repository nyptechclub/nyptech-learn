import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/general/icon-badge";
import ChapterTitleForm from "./titleform";
import ChapterDescriptionForm from "./descriptionform";
import VideoForm from "./video";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./ChapterActions";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.query.chapters.findFirst({
    where: (chapters, { and }) =>and(
        eq(chapters.id, params.chapterId), 
        eq(chapters.courseId, params.courseId)),
    with: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const RequiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];
  const total = RequiredFields.length;
  const completed = RequiredFields.filter(Boolean).length;
  const completetion = `(${completed}/${total})`
  const isComplete = RequiredFields.every(Boolean)
  return (
    <>
    {!chapter.isPublished && (
      <Banner
      variant="warning"
      label="This chapter is not published"/>
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center mb-6">
            <ArrowLeft/>
            Back to course setup
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Chapter Creation
              </h1>
              <span className="text-sm">
                Complete all fields {completetion}
              </span>
            </div>
            <ChapterActions
            disabled={!isComplete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}/>
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
                title: chapter.title ?? ""
              }}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <ChapterDescriptionForm
              initialData={{
                description: chapter.description ?? ""
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
            videoUrl: chapter.videoUrl ?? ""
          }}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChapterIdPage;
