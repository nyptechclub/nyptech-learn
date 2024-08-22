import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const fullData = await db.user_progress.findFirst({
      where: { user_id: params.id },
      select: { points: true },  // Select only the 'points' field
    });

    const data = fullData ? fullData.points : null;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
