import { db } from "@/lib/db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { roomname: string } }) => {
  const { roomname } = params;

  // Fetch all feedbacks from the database
  const feedbacks = await db.feedback.findMany({
    where: {
      roomname,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch usernames for each feedback
  const feedbacksWithUsername = await Promise.all(feedbacks.map(async (feedback) => {
    const user = await clerkClient.users.getUser(feedback.userId);
    return {
      ...feedback,
      username: user.username || "Anonymous",
    };
  }));

  return NextResponse.json(feedbacksWithUsername);
};

export const POST = async (req: NextRequest, { params }: { params: { roomname: string } }) => {
  const { roomname } = params;
  const body = await req.json();
  const user = await currentUser()
  if (!body.text || !body.userId) {
    return new NextResponse("Missing text or userId", { status: 400 });
  }

  const username = user?.username || user?.firstName ||"Anonymous";

  // Store the feedback in the database
  const newFeedback = await db.feedback.create({
    data: {
      roomname,
      userId: body.userId,
      text: body.text,
      username, // Store the username directly
    },
  });

  return NextResponse.json(newFeedback);
};
