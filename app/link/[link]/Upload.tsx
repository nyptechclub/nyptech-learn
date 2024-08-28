"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  link: string;
}

const Upload = ({ link }: Props) => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const router = useRouter();

  const handleUploadComplete = async (url: string) => {
    if (!url || !fileName) {
      alert("Upload failed or file name missing. Please try again.");
      return;
    }
    const roomname = link;
    try {
      const response = await fetch(`/api/link/${roomname}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: url, filename: fileName }), // Send both URL and file name
      });

      if (response.ok) {
        setText(""); // Clear the state
        setFileName(""); // Clear the file name input
        router.refresh(); // Refresh the page
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to upload");
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl mx-auto justify-center items-center">
      <div className="card-body">
        <h1 className="card-title">Activity: {link}</h1>
        <input
          type="text"
          placeholder="Enter file name"
          className="input input-bordered w-full mb-4"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <UploadButton
          endpoint="courseAttachment"
          onClientUploadComplete={(res) => {
            const uploadedUrl = res?.[0].url;
            setText(uploadedUrl);
            handleUploadComplete(uploadedUrl);
          }}
          onUploadError={(error: Error) => {
            toast.error("Unable to upload");
          }}
        />
      </div>
    </div>
  );
};

export default Upload;
