import { auth } from "@clerk/nextjs/server";
const allowed = [
    "user_2gG1vWNpCWeqcgCUAQgrwtEnoNH"
]
export const isAdmin = () => {
    const {userId} = auth();
    if (!userId){
        return false
    }
    return allowed.indexOf(userId) !== -1
}
 