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

    if (!course?.category_id || !course.title || !course.description || !course.imageSrc) {
      return new NextResponse("Missing Fields", { status: 401 });
    }

    const published = await db.cCourses.update({
      where: {
        id: params.courseId,
      },
      data: {
        is_published: true,
      },
    });

    return NextResponse.json(published);
  } catch (error) {
    console.log("/api/chapter-published", error);
    return new NextResponse("Cannot edit chapter", { status: 500 });
  }
}
