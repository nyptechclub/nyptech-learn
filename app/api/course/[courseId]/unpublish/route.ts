import db from "@/db/drizzle";
import { cCourses, courses } from "@/db/schema";
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
      

    if (!course) {
      return new NextResponse("Missing Fields", { status: 404 });
    }
    const unpublished = await db.update(cCourses)
    .set({ isPublished: false })
    .where(
      and(
        eq(cCourses.id, params.courseId),
      )
    )
    .returning()
    .then(res => res[0]);
      return NextResponse.json(unpublished)
    
    } catch (error) {
        console.log("/api/course-not-published", error);
        return new NextResponse("Cannot edit course", { status: 500 });
      }
    }
    