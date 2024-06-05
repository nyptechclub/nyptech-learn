import db from "@/db/drizzle"
import { attachments } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params} : {params: {courseId: string, attachmentId: string}}
){
    try{
        const {userId} = auth()
        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        const attachment = await db
        .delete(attachments)
        .where(eq(attachments.id, params.attachmentId));
        return NextResponse.json(attachment)
    }catch(error){
        console.log("Server Error Deleting Attachment", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}