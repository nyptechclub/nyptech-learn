import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Home() {
    return ( 
        <section>
            <ClerkLoading>
            <span className="loading loading-infinity loading-sm"></span>

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