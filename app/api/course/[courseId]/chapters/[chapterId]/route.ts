import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cCourses, chapters } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chapter = await db.query.chapters.findFirst({
      where: and(
        eq(chapters.id, params.chapterId),
        eq(chapters.courseId, params.courseId)
      ),
    });
    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deleted = await db
      .delete(chapters)
      .where(eq(chapters.id, params.chapterId));
    const published = await db.query.chapters.findMany({
      where: and(
        eq(chapters.id, params.chapterId),
        eq(chapters.isPublished, true)
      ),
    });
    if (!published.length) {
      const updatedCourse = await db
        .update(cCourses)
        .set({ isPublished: false })
        .where(eq(cCourses.id, params.courseId))
        .returning()
        .then((res) => res[0]);
    }
    return NextResponse.json(deleted);
  } catch (error) {
    console.log("/api/chapterdelete", error);
    return new NextResponse("Cannot edit chapter", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isPublished, ...values } = await req.json();

    const chapter = await db
      .update(chapters)
      .set(values)
      .where(
        and(
          eq(chapters.id, params.chapterId),
          eq(chapters.courseId, params.courseId)
        )
      )
      .returning()
      .then((res) => res[0]);

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }


    return new NextResponse("Chapter updated successfully", { status: 200 });
  } catch (error) {
    console.log("/api/chaptertitle", error);
    return new NextResponse("Cannot edit chapter", { status: 500 });
  }
}
