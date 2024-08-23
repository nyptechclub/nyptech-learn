"use client";
import { Feedback } from "@prisma/client";
import { useEffect, useState } from "react";

type RoomFeedbackProps = {
  roomname: string;
};

export const RoomFeedback = ({ roomname }: RoomFeedbackProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await fetch(`/api/room/${roomname}/feedback`);
      const data = await response.json();
      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, [roomname]);

  // Filter feedbacks based on the search term
  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card-body w-full">
      <h2 className="card-title">Feedback for {roomname}</h2>

      <input
        type="text"
        placeholder="Search feedback..."
        className="input input-bordered w-full my-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul>
        {filteredFeedbacks.map((feedback) => (
          <li key={feedback.id}>
            <p>{feedback.text}</p>
            <small>By User: {feedback.username}</small>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};
