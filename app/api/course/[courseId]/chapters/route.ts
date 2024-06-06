import db from "@/db/drizzle";
import { chapters } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
){
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.query.chapters.findFirst({
      where: eq(chapters.courseId, params.courseId),
      orderBy: (chapters, {desc}) => [desc(chapters.position)],
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const newChapter = await db.insert(chapters).values({
      title,
      courseId: params.courseId,
      position: newPosition,
    });

    return NextResponse.json(newChapter);
  } catch (error) {
    console.log("[Chapters]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
