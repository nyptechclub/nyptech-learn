import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
    return ( 
        <section className="flex items-center justify-center flex-col hero-content">
                <img src="https://nyptech-learn.vercel.app/favicon.ico"></img>
                <div className="text-2xl font-bold">
                    NYPTECH-LEARN
                </div>
                <div>
                    Learn With Us, sign in to continue.
                </div>
                <Link href="/learn" className="btn">
                    Learn Now
                </Link>
                
        </section>
     );
}