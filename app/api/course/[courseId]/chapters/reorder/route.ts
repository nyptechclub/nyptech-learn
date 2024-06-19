import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { chapters } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();
        for (let item of list) {
            await db.update(chapters)
                .set({ position: item.position })
                .where(eq(chapters.id, item.id));
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("Reorder Error", error);
        return new NextResponse("Reorder Error", { status: 500 });
    }
}
