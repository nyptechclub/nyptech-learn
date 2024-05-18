"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Promo = () => {
    return ( 
        <div className="border-2 rounded-xl p-4 space-y-4 mt-4"><div className="space-y-2">
            {/* <div className="flex items-center gap-x-2">
                <Image
                src="/unlimited.svg"
                alt="unlimited"
                height={26}
                width={26}/>
                <div className="font-bold text-lg">
                    Upgrade to pro
                </div>
            </div>
            <div className="text-muted-foreground">
                Get unlimited hearts and more!
            </div> */}
            Shop
        </div><Link href="/shop">

        <Button className="btn w-full btn-lg">
            Upgrade today
        </Button>
        </Link>
        </div>
     );
}
 
export default Promo;