import db from "@/db/drizzle";
import { chapters } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
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
      const chapter = await db.query.chapters.findFirst({
        where: and(
          eq(chapters.id, params.chapterId),
          eq(chapters.courseId, params.courseId)
        )
      });
      

    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing Fields", { status: 401 });
    }
    const published = await db.update(chapters)
    .set({ isPublished: true })
    .where(
      and(
        eq(chapters.id, params.chapterId),
        eq(chapters.courseId, params.courseId)
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
    