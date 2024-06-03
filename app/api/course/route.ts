import db from "@/db/drizzle";
import { cCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.insert(cCourses).values({
            id: createId(),
            userId,
            title,
            // You can add other fields with default values here if needed
        }).returning({
            id: cCourses.id,
            title: cCourses.title,
            userId: cCourses.userId
        }); // Ensure to return specific fields

        return NextResponse.json(course[0]); // Return the first (and only) item in the array
    } catch (error: any) {
        if (error.code === '23505' && error.constraint === 'cCourses_pkey') {
            console.log("Duplicate key error:", error);
            return new NextResponse("Duplicate course ID", { status: 409 });
        }
        console.log("course", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
