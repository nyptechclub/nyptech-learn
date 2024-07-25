import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
title: string
}
export const Header = ({title}: Props) => {
    return ( 
        <Link href="/courses"><Button variant="expandIcon" Icon={ArrowLeft} iconPlacement="left" className="text-2xl p-5 btn-link">
        Back to {title}</Button></Link>
    );
}