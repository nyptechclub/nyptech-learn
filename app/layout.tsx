import './globals.css';
import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Home, Loader, Menu, ShoppingCart, Sword, Trophy } from "lucide-react";
import Link from 'next/link';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="cupcake">
        <body>
          <div className="flex flex-col container p-5">
            <header className="navbar bg-base-300 p-5 rounded-xl">
              <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer" className=" drawer-button"><Menu /></label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                  <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    <li><Link href="/learn"><Home />Learn</Link></li>
                    <li><Link href="/leaderboard"><Trophy />Leaderboard</Link></li>
                    <li><Link href="/quests"><Sword />Quests</Link></li>
                    <li><Link href="/shop"><ShoppingCart />Shop</Link></li>
                  </ul>
                </div>
              </div>
              <div className="flex-end">
                <ClerkLoading>
                  <Loader className="w-5 h-5"></Loader>
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

            </header>
          </div>
          <main className="flex container flex-col">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}