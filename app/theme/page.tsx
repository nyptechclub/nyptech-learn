import { Input } from "./gg"; 
import { getUserProgress } from "@/lib/queries";
const ChatPage = async() => {
    const stream = await getUserProgress()

    return (
            <div className="card-body">
                <h1 className="card-title">
                    Theme Settings
                </h1>
                <div>
                    Every good wizard needs a bit of style!
                </div>
                {stream?.user_id === null || stream?.user_id === undefined ? (
                    <div className="justify-center">Theme not found</div>
                ) : (
                <div className="form-control">
                <Input
                string={stream.theme}
                />

                </div>)}
            </div>
    );
}

export default ChatPage;