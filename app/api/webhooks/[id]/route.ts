import db from "@/db/drizzle"
import { userProgress } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async(
    req: Request, {params}: {params:{id: string}}
) =>{
    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, params.id),
    })
    return NextResponse.json(data)
}
