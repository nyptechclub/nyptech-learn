import db from "@/db/drizzle"
import { getUserSubscription } from "@/db/queries"
import { userProgress } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async (
  req: Request, { params }: { params: { id: string } }
) => {
  try {
    const fullData = await getUserSubscription()
    // Manually select only the points field to return
    const data = fullData ? fullData.isActive : null;

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch user progress:', error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
}
