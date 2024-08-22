import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createId } from '@paralleldrive/cuid2';
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.chapters.findFirst({
      where: {
        course_id: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Generate a unique ID for the new chapter
    const newId = createId();

    try {
      const newChapter = await db.chapters.create({
        data: {
          id: newId,
          title,
          course_id: params.courseId,
          position: newPosition,
        },
      });

      return NextResponse.json(newChapter);
    } catch (insertError) {
      console.error("Insert Error: ", insertError);
      if (insertError instanceof Error && insertError.message.includes('Unique constraint failed')) {
        return new NextResponse("Duplicate key error", { status: 409 });
      }
      throw insertError;
    }
  } catch (error) {
    console.error("[Chapters]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
