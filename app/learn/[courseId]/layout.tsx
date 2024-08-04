import { Button } from "@/components/ui/button";
import db from "@/db/drizzle";
import { cCourses, categories, chapters } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, asc } from "drizzle-orm"; // Import asc function
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

  const course = await db.query.cCourses.findFirst({
    where: eq(cCourses.id, courseId),
  });

  if (!course) {
    return redirect("/courses");
  }

  const categoryId = course.categoryId;

  if (!categoryId) {
    return redirect("/courses");
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });

  // Fetch and sort chapters by position
  const chapter = await db.query.chapters.findMany({
    where: eq(chapters.courseId, course.id),
    orderBy: asc(chapters.position), // Use asc function
  });

  return (
    <div className="flex flex-row">
      <div className="menu rounded-box flex-col flex p-5 bg-base-200 menu-horizontal">
        <h1 className="text-xl font-bold p-5">{course.title}</h1>
        <div className="gap-5 flex w-56 flex-col">
          {chapter.map((item: any) => (
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
