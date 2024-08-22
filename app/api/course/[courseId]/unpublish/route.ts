import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.cCourses.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse("Missing Fields", { status: 404 });
    }

    const unpublished = await db.cCourses.update({
      where: {
        id: params.courseId,
      },
      data: {
        is_published: false,
      },
    });

    return NextResponse.json(unpublished);
  } catch (error) {
    console.log("/api/course-not-published", error);
    return new NextResponse("Cannot edit course", { status: 500 });
  }
}
