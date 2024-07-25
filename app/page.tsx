import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
    return (
        <section className="flex items-center justify-center hero">
            <div className="flex bg-base-200 rounded-xl p-5 items-center justify-center text-base-content flex-col hero-content gap-3 m-5">
                <img src="https://nyptech-learn.vercel.app/favicon.ico"></img>
                <div className="text-2xl font-bold">
                    NYPTECH-LEARN
                </div>
                <div className="text-xl">
                Faster Iteration, More Innovation
                </div>
                <img src="/wizard.png" className="w-20 h-20" />
                <div className="m-5">
                &quot;You are finally awake!&quot; As dawn broke over Pixeltown, the gentle hum of the bustling digital city filled the air. You wake up feeling groggy and disoriented, finding yourself lying on a cobblestone path. A boy loomed over you as if he has excited to see you. As you sat up, you noticed your attire: a deep purple wizard&apos;s robe adorned with shimmering silver runes. You raised his hands and saw 5 glowing chakras pulsating gently in your palms, a tangible measure of your life force. &quot;You dropped from the sky, we taught you were dead! Well I better be going now, the tournament is about to begin&quot; Before rush off into the distance. 
                </div>
                <img src="/boy.png" className="w-20 h-20" />
                <Link href="/courses" className="btn btn-secondary animate-pulse">
                    Learn Now
                </Link>
            </div>
        </section>
    );
}