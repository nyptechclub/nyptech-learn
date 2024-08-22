import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
};

const CourseLayout = async ({ children, params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courseId = params.courseId;

  if (!courseId) {
    return redirect("/courses");
  }

  const course = await db.cCourses.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return redirect("/courses");
  }

  const categoryId = course.category_id;

  if (!categoryId) {
    return redirect("/courses");
  }

  const category = await db.categories.findUnique({
    where: { id: categoryId },
  });

  // Fetch and sort chapters by position
  const chapters = await db.chapters.findMany({
    where: { course_id: course.id },
    orderBy: { position: 'asc' },
  });

  return (
    <div className="flex flex-row">
      <div className="menu rounded-box flex-col flex p-5 bg-base-200 menu-horizontal">
        <h1 className="text-xl font-bold p-5">{course.title}</h1>
        <div className="gap-5 flex w-56 flex-col">
          {chapters.map((item) => (
            <Link
              key={item.id}
              href={`/learn/${courseId}/${item.id}`}
              className="w-full btn-secondary btn"
            >
              {item.title}
            </Link>
          ))}
          {userId === course.userId && (
            <Link
              className="btn btn-outline w-full"
              href={`/teacher/courses/${courseId}`}
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      <main className="h-full m-5">{children}</main>
    </div>
  );
};

export default CourseLayout;
