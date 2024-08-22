import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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

        const updatedCourse = await prisma.cCourses.update({
            where: { id: courseId },
            data: values,
        });

        return new NextResponse(JSON.stringify(updatedCourse), { status: 200 });
    } catch (error) {
        console.error("API/course/courseId", error);
        return new NextResponse("Internal API error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await prisma.cCourses.findUnique({
            where: { id: params.courseId },
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const deletedCourse = await prisma.cCourses.delete({
            where: { id: params.courseId },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("/api/course-delete", error);
        return new NextResponse("Cannot delete course", { status: 500 });
    }
}
