import { auth } from "@clerk/nextjs/server";
const allowed = [
    "user_2fniakcT7kncz8yCpdLtLg1XF9j",
    "user_2fzELTTJvLMzvEd9BVcMbnz8KxT",
]
export const isAdmin = () => {
    const {userId} = auth();
    if (!userId){
        return false
    }
    return allowed.indexOf(userId) !== -1
}
 