import Link from "next/link";
import { Button } from "../ui/button";
import { quests } from "@/constants";
import { Sword } from "lucide-react";
import { Progress } from "../ui/progress";
type Props = {
    points: number
}
const Quests = ({ points }: Props) => {
    return (
        <div className="border-2 rounded-xl p-4  mt-4 flex flex-row justify-between w-full">
            <div className="font-bold text-lg">
                Quests
            </div>
            <Link
                href="/quests">
                <Button className="btn">
                    View All Quests
                </Button>
            </Link>
        </div>);
}

export default Quests;