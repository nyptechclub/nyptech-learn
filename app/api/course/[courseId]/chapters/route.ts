import db from "@/db/drizzle";
import { chapters } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createId } from '@paralleldrive/cuid2';

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

    const lastChapter = await db.query.chapters.findFirst({
      where: eq(chapters.courseId, params.courseId),
      orderBy: (chapters, { desc }) => [desc(chapters.position)],
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Generate a unique ID for the new chapter
    const newId = createId();

    try {
      const newChapter = await db.insert(chapters).values({
        id: newId,
        title,
        courseId: params.courseId,
        position: newPosition,
      });

      return NextResponse.json(newChapter);
    } catch (insertError) {
      console.error("Insert Error: ", insertError);
      if (insertError instanceof Error && insertError.message.includes('duplicate key value violates unique constraint')) {
        return new NextResponse("Duplicate key error", { status: 409 });
      }
      throw insertError;
      // Rethrow if it's a different error
    }
  } catch (error) {
    console.error("[Chapters]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
