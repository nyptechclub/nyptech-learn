"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface Props{
  params:{
    link: string
  }
}
const RoomPage = ({params}: Props) => {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleUploadComplete = async (url: string) => {
    if (!url) {
      alert("Upload failed. Please try again.");
      return;
    }
    const roomname =  params.link
    try {
      const response = await fetch(`/api/link/${roomname}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: url }), 
      });

      if (response.ok) {
        setText(""); // Clear the state
        router.refresh(); // Refresh the page
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to upload")
    }
  };

  return (
    <div>
      <p>
        </p>{params.link}
 <UploadButton
      endpoint="courseAttachment"
      onClientUploadComplete={(res) => {
        const uploadedUrl = res?.[0].url;
        setText(uploadedUrl);
        handleUploadComplete(uploadedUrl);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
    </div>
   
  );
};

export default RoomPage;
