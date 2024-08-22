import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
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

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await db.chapters.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChapters = await db.chapters.findMany({
      where: {
        course_id: params.courseId,
        is_published: true,
      },
    });

    if (publishedChapters.length === 0) {
      await db.cCourses.update({
        where: {
          id: params.courseId,
        },
        data: {
          is_published: false,
        },
      });
    }

    return new NextResponse("Chapter deleted successfully", { status: 200 });
  } catch (error) {
    console.error("/api/chapterdelete", error);
    return new NextResponse("Cannot delete chapter", { status: 500 });
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

    const chapter = await db.chapters.update({
      where: {
        id: params.chapterId,
        course_id: params.courseId,
      },
      data: values,
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    return new NextResponse("Chapter updated successfully", { status: 200 });
  } catch (error) {
    console.error("/api/chaptertitle", error);
    return new NextResponse("Cannot edit chapter", { status: 500 });
  }
}
