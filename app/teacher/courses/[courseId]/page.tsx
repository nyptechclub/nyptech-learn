//@ts-nocheck
import { IconBadge } from "@/components/general/icon-badge";
import { auth } from "@clerk/nextjs/server";
import { File, LayoutDashboardIcon, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./titleform";
import DescriptionForm from "./descriptionform";
import ImageForm from "./imageform";
import CategoryForm from "./categoryform";
import Attachment from "./attachment";
import Chapters from "./chapters";
import { Banner } from "@/components/banner";
import { CourseActions } from "./CourseActions";
import { db } from "@/lib/db";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const courseId = params.courseId;

  const course = await db.cCourses.findUnique({
    where: { id: courseId },
    include: {
      attachments: {
        orderBy: { created_at: 'desc' },
      },
      chapters: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    return redirect("/lesson");
  }

  const category = await db.categories.findMany();

  const requiredFields = [
    course.title,
    course.description,
    course.imageSrc,
    course.category_id,
    course.chapters.some(chapter => chapter.is_published),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const sanitizedCourse = {
    ...course,
    title: course.title ?? "",
    description: course.description ?? "",
    imageSrc: course.imageSrc ?? "",
    categoryId: course.category_id ?? "",
  };

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.is_published && (
        <Banner
          label="This course is unpublished, it is currently not visible."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm">
              Complete all fields {completionText}
            </span>
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.is_published}
          />
        </div>
        <div className="grid gap-6 mt-16">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboardIcon} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          <TitleForm
            initialData={sanitizedCourse}
            courseId={course.id}
          />
          <DescriptionForm
            initialData={sanitizedCourse}
            courseId={course.id}
          />
          <ImageForm
            initialData={sanitizedCourse}
            courseId={course.id}
          />
          <CategoryForm
            initialData={sanitizedCourse}
            courseId={course.id}
            options={category.map((category) => ({
              label: category.name,
              value: category.id
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">
                Course Chapters
              </h2>
            </div>
            <div>
              <Chapters
                initialData={sanitizedCourse}
                courseId={course.id}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">
                Resources and Attachments
              </h2>
            </div>
            <div>
              Course related materials
              <Attachment
                initialData={sanitizedCourse}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseIdPage;
