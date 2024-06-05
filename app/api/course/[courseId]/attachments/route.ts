import db from "@/db/drizzle"
import { attachments } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
){
    try{
        const {userId} = auth()
        const {url} = await req.json()
        if (!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        const attachment = await db.insert(attachments).values({
                url,
                name: url.split("/").pop(),
                courseId: params.courseId
        })
        return NextResponse.json(attachment)
    }catch(error){
        console.log("Attachment error", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}