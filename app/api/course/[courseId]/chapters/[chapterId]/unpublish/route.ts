import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapters.findFirst({
      where: {
        id: params.chapterId,
        course_id: params.courseId,
      },
    });

    if (!chapter || !chapter.title || !chapter.description || !chapter.video_url) {
      return new NextResponse("Missing Fields", { status: 404 });
    }

    const unpublished = await db.chapters.update({
      where: {
        id: params.chapterId,
      },
      data: {
        is_published: false,
      },
    });

    const totalPublished = await db.chapters.findMany({
      where: {
        course_id: params.courseId,
        is_published: true,
      },
    });

    if (totalPublished.length === 0) {
      await db.cCourses.update({
        where: {
          id: params.courseId,
        },
        data: {
          is_published: false,
        },
      });
    }

    return NextResponse.json(unpublished);
  } catch (error) {
    console.error("/api/chapter-not-published", error);
    return new NextResponse("Cannot edit chapter", { status: 500 });
  }
}
