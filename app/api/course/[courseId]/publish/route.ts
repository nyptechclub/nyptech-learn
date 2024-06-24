import db from "@/db/drizzle";
import { cCourses, chapters } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; } }
  ) {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const course = await db.query.cCourses.findFirst({
        where: and(
          eq(cCourses.id, params.courseId),
        )
      });
      

    if (!course?.categoryId || !course.title || !course.description || !course.imageSrc) {
      return new NextResponse("Missing Fields", { status: 401 });
    }
    const published = await db.update(cCourses)
    .set({ isPublished: true })
    .where(
      and(
        eq(cCourses.id, params.courseId),
        // eq(cCourses.userId, userId)
        //todo: incase things get out of hand this allows only creater to publish, I want to allow access for others to publish incase we cannot contact pubisher. This access can still be accessed so long as we have access to db by manually changing in drizzle
      )
    )
    .returning()
    .then(res => res[0]);
      return NextResponse.json(published)
    
    } catch (error) {
        console.log("/api/chapter-published", error);
        return new NextResponse("Cannot edit chapter", { status: 500 });
      }
    }
    