"use client"
import { auth } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FeedbackFormProps = {
  roomname: string;
  userId: string
};

export const FeedbackForm = ({ roomname, userId }: FeedbackFormProps) => {
  const [text, setText] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !userId) {
      alert("Please fill in all fields");
      return;
    }

    await fetch(`/api/room/${roomname}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, userId }),
    });

    setText("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <textarea
        placeholder="Your comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="textarea"
      />
      <button type="submit" className="btn">Submit</button>
    </form>
  );
};
