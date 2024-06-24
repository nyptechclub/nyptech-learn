import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";


const bannerVarients = cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants:{
            variant:{
                warning: "text-primary bg-warning",
                success: "text-secondary bg-success"
            }
        },
        defaultVariants:{
            variant: "warning",
        }
    },
    
)
interface Props extends VariantProps<typeof bannerVarients> {
 label: string
}
const iconMap={
    warning: AlertTriangle,
    success: CheckCircleIcon,
}
export const Banner = ({
label, variant
}: Props) => {
    const Icon = iconMap[variant || "warning"]
    return ( 
        <div className={cn(bannerVarients({
            variant
        }))}>
            <Icon className="size-4"/>
            {label}
        </div>
    );
}