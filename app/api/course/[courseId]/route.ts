import db from "@/db/drizzle";
import { cCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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

        const course = await db.update(cCourses)
            .set(values)
            .where(eq(cCourses.id, courseId));

        return new NextResponse(JSON.stringify(course), { status: 200 });
    } catch (error) {
        console.log("API/course/courseId", error);
        return new NextResponse("Internal API error", { status: 500 });
    }
}
