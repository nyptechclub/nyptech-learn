import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export const GET = async (
  req: Request,
  { params }: { params: { courseId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await db.courses.findUnique({
    where: {
      id: params.courseId,
    },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();

  const data = await db.courses.update({
    where: {
      id: params.courseId,
    },
    data: {
      ...body,
    },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: number } }
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const data = await db.courses.delete({
    where: {
      id: params.courseId,
    },
  });

  return NextResponse.json(data);
};
