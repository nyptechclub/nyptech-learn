import { db } from "@/lib/db";
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

        const course = await db.cCourses.create({
            data: {
                id: createId(),
                userId,
                title,
            },
            select: {
                id: true,
                title: true,
                userId: true,
            },
        });

        return NextResponse.json(course);
    } catch (error: any) {
        if (error.code === 'P2002') { // Prisma unique constraint violation code
            console.log("Duplicate key error:", error);
            return new NextResponse("Duplicate course ID", { status: 409 });
        }
        console.log("course", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
