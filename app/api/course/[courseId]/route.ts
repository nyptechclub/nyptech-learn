import db from "@/db/drizzle";
import { cCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedCourse = await db.update(cCourses)
            .set(values)
            .where(eq(cCourses.id, courseId))
            .returning();

        return new NextResponse(JSON.stringify(updatedCourse), { status: 200 });
    } catch (error) {
        console.error("API/course/courseId", error);
        return new NextResponse("Internal API error", { status: 500 });
    }
}
export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; } }
  ) {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const chapter = await db.query.cCourses.findFirst({
        where: and(
          eq(cCourses.id, params.courseId)
        ),
      });
      if (!chapter) {
        return new NextResponse("Not Found", { status: 404 });
      }
      const deleted = await db
        .delete(cCourses)
        .where(eq(cCourses.id, params.courseId));
      return NextResponse.json(deleted);
    } catch (error) {
      console.log("/api/course-delete", error);
      return new NextResponse("Cannot edit chapter", { status: 500 });
    }
  }