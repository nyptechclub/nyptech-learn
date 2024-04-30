import { Feedwrapper } from "@/components/ui/feed-wrapper";
import { Header } from "./header";
import Link from "next/link";
import { Coins, HeartPulseIcon, InfinityIcon } from "lucide-react";

type Props = {
    points: number;
    subbed: boolean;
    hearts: number;
    active: {
        imgsrc: string;
        title: string;
    };
};

const Learn = ({ points, subbed, hearts, active }: Props) => {
    return ( 
        <section>
            <Feedwrapper>
                <div className="flex justify-end items-center w-full">
                    <Header title="Spanish" />
                    {/* Drawer for Progress */}
                    <div className="drawer drawer-end justify-end">
                        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex justify-end"> {/* Ensure this is also justified to the end */}
                            <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Progress</label>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer-4" className="drawer-overlay" aria-label="close sidebar"></label>
                            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                                <div className="flex gap-2">
                                    <Link href="/shop" className="btn btn-outline flex items-center gap-2">
                                        {points} <Coins />
                                    </Link>
                                    <Link href="/shop" className="btn btn-outline flex items-center gap-2">
                                        <HeartPulseIcon />
                                        {subbed ? <InfinityIcon className="h-4 w-4" /> : hearts}
                                    </Link>
                                </div>
                                <li><a>Sidebar Item 1</a></li>
                                <li><a>Sidebar Item 2</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {Array.from({ length: 1000 }).map((_, index) => (
                    <div key={index}> {/* Always use a key when mapping over arrays in React */}
                        hello
                    </div>
                ))}
            </Feedwrapper>
        </section>
     );
};

export default Learn;
