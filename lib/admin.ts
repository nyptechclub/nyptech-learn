import { auth } from "@clerk/nextjs/server";
const allowed = [
    "user_2fniakcT7kncz8yCpdLtLg1XF9j",
    "user_2fzELTTJvLMzvEd9BVcMbnz8KxT",
    "user_2g0nPvVwObjp7M4Gy1wISmlhtrf",
]
export const isAdmin = () => {
    const {userId} = auth();
    if (!userId){
        return false
    }
    return allowed.indexOf(userId) !== -1
}
 