import { db } from "@/lib/db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export const GET = async (req: NextRequest, { params }: { params: { roomname: string } }) => {
    const { roomname } = params;
  
    const feedbacks = await db.link.findMany();
  
    const linkWithUsername = await Promise.all(feedbacks.map(async (feedback) => {
      const user = await clerkClient.users.getUser(feedback.userId);
      return {
        ...feedback,
        username: user.username || "Anonymous",
      };
    }));
  
    return NextResponse.json(linkWithUsername);
  };
  

  export const POST = async (req: NextRequest, { params }: { params: { roomname: string } }) => {
    const { userId } = auth();
  
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    const { roomname } = params;
    const body = await req.json();
  
    if (!body.text || !body.filename) {  // Corrected to 'filename'
      return new NextResponse("Missing text or filename", { status: 400 });
    }
  
    const user = await currentUser();
    const username = user?.username || user?.firstName + " " + user?.lastName || "Anonymous";
  
    // Store the file information in the database
    const newLink = await db.link.create({
      data: {
        roomname,
        userId: userId,
        text: body.text,
        username,
        filename: body.filename,
      },
    });
    revalidatePath(`/link/${roomname}`)
    revalidatePath(`/link/${roomname}/admin`)
    return NextResponse.json(newLink);
  };