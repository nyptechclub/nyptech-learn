import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chapters, muxData } from "@/db/schema";
import { eq, and } from "drizzle-orm";


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

        const chapter = await db.update(chapters)
            .set(values)
            .where(and(eq(chapters.id, params.chapterId), eq(chapters.courseId, params.courseId)))
            .returning()
            .then(res => res[0]); // Assuming `returning` returns an array

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        if (values.videoUrl) {
            const existingData = await db.query.muxData.findFirst({
                where: eq(muxData.chapterId, params.chapterId),
            });
        }

        return new NextResponse("Chapter updated successfully", { status: 200 });
    } catch (error) {
        console.log("/api/chaptertitle", error);
        return new NextResponse("Cannot edit chapter", { status: 500 });
    }
}
