"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Promo = () => {
    return ( 
        <Link href="/shop">
        <Button className="btn w-full">
            Get More Hearts
        </Button>
        </Link>
     );
}
 
export default Promo;