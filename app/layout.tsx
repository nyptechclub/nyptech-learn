import ExitModal from '@/components/modals/exit-modal';
import './globals.css';
import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { BookCheck, BookOpen, Home, Loader, Menu, Settings2, ShoppingCart, Sword, Trophy } from "lucide-react";
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner"
import HeartsModal from '@/components/modals/hearts-modal';
import PracticeModal from '@/components/modals/practice-modal';
import { currentUser } from '@clerk/nextjs/server';
import { getUserProgress } from '@/lib/queries';
const RootLayout = async({
  children,
}: {
  children: React.ReactNode
}) =>  {
    const self = await getUserProgress();
     return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex bg-base-100 text-base-content">
          <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
              <div className="navbar bg-accent-foreground">
                <div className="flex-1 lg:hidden">
                  <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                    <Menu className="text-accent"/>
                  </label>
                </div>
                
                <div className="flex-none hidden lg:block">
                <input type="checkbox"         
value={self?.theme ?? "cupcake"} 
 className="invisible theme-controller" checked disabled/>
                  <ul className="menu menu-horizontal text-accent">
                    <li><Link href="/learn"><Home/>Learn</Link></li>
                    <li><Link href="/leaderboard"><Trophy/>Leaderboard</Link></li>
                    <li><Link href="/quests"><Sword/>Quests</Link></li>
                    <li><Link href="/shop"><ShoppingCart  />Shop</Link></li>
                    <li><Link href="/theme"><ShoppingCart  />Theme</Link></li>

                  </ul>
                </div>
                <div className="flex-end">
                  <ClerkLoading>
                    <span className="loading loading-infinity loading-sm text-accent"></span>
                  </ClerkLoading>
                  <ClerkLoaded>
                    <SignedOut>
                      <Button><SignInButton
                        mode="modal"
                        forceRedirectUrl="/learn"
                        signUpForceRedirectUrl="/learn"
                      />
                      </Button>
                    </SignedOut>
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </ClerkLoaded>
                </div>
              </div>
              
              <main className="flex flex-col ">
              <Toaster />
                <ExitModal/>
                <HeartsModal/>
                <PracticeModal/>
                {children}
              </main>

            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-accent-content gap-4">
              <li ><Link href="/" className="btn btn-accent"><Home/>Home</Link></li>
                <li><Link href="/learn" className="btn btn-accent"><BookCheck/>Learn</Link></li>
                <li><Link href="/courses" className="btn btn-accent"><BookOpen/>All Courses</Link></li>
                <li><Link href="/leaderboard" className="btn btn-accent"><Trophy />Leaderboard</Link></li>
                <li><Link href="/quests" className="btn btn-accent"><Sword/>Quests</Link></li>
                <li><Link href="/shop" className="btn btn-accent"><ShoppingCart />Shop</Link></li> 
                <li><Link href="/theme" className="btn btn-accent"><Settings2 />Theme</Link></li> 
                {/* Putting the btn in list makes it look like double button (li) is needed for sidebar */}
              </ul>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
export default RootLayout