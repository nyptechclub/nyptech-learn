import ExitModal from '@/components/modals/exit-modal';
import './globals.css';
import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Home, Loader, Menu, ShoppingCart, Sword, Trophy } from "lucide-react";
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner"
import HeartsModal from '@/components/modals/hearts-modal';
import PracticeModal from '@/components/modals/practice-modal';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="cupcake">
        <body>
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
                  <ul className="menu menu-horizontal text-accent">
                    <li><Link href="/learn"><Home className="text-accent"/>Learn</Link></li>
                    <li><Link href="/leaderboard"><Trophy className="text-accent"/>Leaderboard</Link></li>
                    <li><Link href="/quests"><Sword className="text-accent"/>Quests</Link></li>
                    <li><Link href="/shop"><ShoppingCart  className="text-accent" />Shop</Link></li>

                  </ul>
                </div>
                <div className="flex-end">
                  <ClerkLoading>
                    <span className="loading loading-infinity loading-sm"></span>
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
              
              <main className="flex container flex-col">
              <Toaster />
                <ExitModal/>
                <HeartsModal/>
                <PracticeModal/>
                {children}
              </main>

            </div>
            <div className="drawer-side">
              <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-accent-foreground text-accent">
                <li><Link href="/learn"><Home className="text-accent"/>Learn</Link></li>
                <li><Link href="/leaderboard"><Trophy className="text-accent" />Leaderboard</Link></li>
                <li><Link href="/quests"><Sword className="text-accent"/>Quests</Link></li>
                <li><Link href="/shop"><ShoppingCart className="text-accent" />Shop</Link></li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}