import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "lucide-react";

export default function Home() {
    return ( 
        <section>
            <ClerkLoading>
                <Loader className="w-5 h-5"/>
            </ClerkLoading>
            <ClerkLoaded>
                <div className="text-xl">
                    NYPTECH
                </div>
                <div>
                    Learn With Us
                </div>
            </ClerkLoaded>
        </section>
     );
}