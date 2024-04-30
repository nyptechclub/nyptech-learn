import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
title: string
}
export const Header = ({title}: Props) => {
    return ( 
        <Button variant="expandIcon" Icon={ArrowLeft} iconPlacement="left" className="text-2xl p-5 ">
        <Link href="/courses">{title}</Link></Button>
    );
}