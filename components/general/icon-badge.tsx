import { cn } from "@/lib/utils"
import {cva, type VariantProps} from "class-variance-authority"
import { LucideIcon } from "lucide-react"
const background = cva(
    "rounded-full flex items-center justify-center",
    {
        variants:{
            variant:{
                default: "bg-base-200",
                success: "bg-emerald-100",
            },
            size:{
                default: "p-2",
                sm: "p-1"
            }
        },
        defaultVariants:{
            variant: "default",
            size:"default",

        }
    }
)
const iconVarient = cva(
    "",
    {
        variants:{
            variant:{
                default: "text-base-content",
                success: "text-emerald-700",
            },
            size:{
                default: "h-8 w-8",
                sm: "h-4 w-4"
            }
        },
        defaultVariants:{
            variant: "default",
            size: "default"
        }
    }
)
type BackgroundProps = VariantProps<typeof background>
type IconVariantsProps = VariantProps<typeof iconVarient>
interface IconBadgeProps extends BackgroundProps, IconVariantsProps{
    icon: LucideIcon
}
export const IconBadge = ({
    icon: Icon,
    variant,
    size,
}:IconBadgeProps) => {
    return(<div className={cn(background({variant, size}))}>
        <Icon className={cn(iconVarient({variant, size}))}/>
    </div>)
}