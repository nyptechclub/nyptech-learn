//@ts-nocheck
import { IconBadge } from "@/components/general/icon-badge";
import db from "@/db/drizzle";
import { attachments, cCourses, categories } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, param } from "drizzle-orm";
import { File, LayoutDashboardIcon, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./titleform";
import DescriptionForm from "./descriptionform";
import ImageForm from "./imageform";
import CategoryForm from "./categoryform";
import Attachment from "./attachment";
import Chapters from "./chapters";
import { Banner } from "@/components/banner";
import { CourseActions } from "./ChapterActions";

const CourseIdPage = async({
    params
}: {
    params:{courseId: string}
}) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
    const category = await db.query.categories.findMany()
    const course = await db.query.cCourses.findFirst({
        where: eq(cCourses.id, params.courseId),
        with: {
          attachments: {
            orderBy: (attachments, { desc }) => [desc(attachments.createdAt)],
          },
          chapters:{
            orderBy: (chapters, { asc }) => [asc(chapters.position)],
          },
        },
      });
    if (!course) {
        return redirect("/lesson");
    }
    
    const requiredFields = [
        course.title,
        course.description,
        course.imageSrc,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished)
    ];
    
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    
    const sanitizedCourse = {
        ...course,
        title: course.title ?? "",
        description: course.description ?? "",
        imageSrc: course.imageSrc ?? "",
        categoryId: course.categoryId ?? ""
    };
    const iscomplete = requiredFields.every(Boolean)
    return ( 
        <>
        {!course.isPublished && (
            <Banner
            label="This course is unplished, it is currently not visible."/>
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
                disabled={!iscomplete}
                courseId={params.courseId}
                isPublished={course.isPublished}/>
            </div>
            <div className="grid gap-6 mt-16">
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboardIcon}/>
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
                    <IconBadge icon={ListChecks}/>
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
                    <IconBadge icon={File}/>
                    <h2 className="text-xl">
                        Resources and  Attachements
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
