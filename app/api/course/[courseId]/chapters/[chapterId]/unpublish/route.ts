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
      return new NextResponse("Missing Fields", { status: 404 });
    }
    const unpublished = await db.update(chapters)
    .set({ isPublished: false })
    .where(
      and(
        eq(chapters.id, params.chapterId),
        eq(chapters.courseId, params.courseId)
      )
    )
    .returning()
    .then(res => res[0]);
    const totalpublished = await db.query.chapters.findMany({
      where: and(
        eq(chapters.courseId, params.courseId),
        eq(chapters.isPublished, true)
      ),
    })
    if(!totalpublished.length){
    await db.update(chapters)
    .set({ isPublished: false })
    .where(
        eq(chapters.courseId, params.courseId)
    )
    }
      return NextResponse.json(unpublished)
    
    } catch (error) {
        console.log("/api/chapter-not-published", error);
        return new NextResponse("Cannot edit chapter", { status: 500 });
      }
    }
    