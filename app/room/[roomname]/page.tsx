import { auth } from "@clerk/nextjs/server";
import { FeedbackForm } from "./FeedbackForm";
import { RoomFeedback } from "./RoomFeedback";
import notfound from "@/app/not-found";
import { redirect } from "next/navigation";

const RoomPage = ({ params }: { params: { roomname: string } }) => {
    const {userId} = auth()
    if(!userId){
        return redirect("/")
    }
  return (
    <div className="card bg-base-100 w-96 shadow-xl flex items-center justify-center mx-auto m-5 p-5">
    <FeedbackForm roomname={params.roomname} userId={userId}/>
    <RoomFeedback roomname={params.roomname} />
      
    </div>
  );
};

export default RoomPage;
