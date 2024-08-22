import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachments.create({
      data: {
        url,
        name: url.split("/").pop(),
        course_id: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("Attachment error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
