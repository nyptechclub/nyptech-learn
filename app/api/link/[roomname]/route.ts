import { db } from "@/lib/db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
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
const {userId} = auth()
if(!userId){
    return notFound()
}
  const { roomname } = params;
  const body = await req.json();
  const user = await currentUser()
  if (!body.text || !body.userId) {
    return new NextResponse("Missing text or userId", { status: 400 });
  }

  const username = user?.username || user?.firstName ||"Anonymous";

  // Store the feedback in the database
  const newFeedback = await db.link.create({
    data: {
      roomname,
      userId: userId,
      text: body.text,
      username,
    },
  });

  return NextResponse.json(newFeedback);
};
