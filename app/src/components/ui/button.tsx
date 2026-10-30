import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-semibold whitespace-nowrap transition-[color,background-color,box-shadow,scale,transform] duration-200 ease-out outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-45 aria-invalid:ring-3 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:scale-[1.03]",
        outline:
          "hover:scale-[1.03] [&.text-destructive]:bg-destructive/10 [&.text-destructive]:hover:bg-destructive/20 [&.text-destructive]:aria-expanded:bg-destructive/20 bg-accent text-accent-foreground hover:bg-brand-100 aria-expanded:bg-brand-100 dark:hover:bg-brand-800/60 dark:aria-expanded:bg-brand-800/60",
        secondary:
          "hover:scale-[1.03] [&.text-destructive]:bg-destructive/10 [&.text-destructive]:hover:bg-destructive/20 [&.text-destructive]:aria-expanded:bg-destructive/20 bg-brand-100 text-brand-900 hover:bg-brand-200 aria-expanded:bg-brand-200 dark:bg-brand-900 dark:text-primary dark:hover:bg-brand-800/70",
        ghost:
          "hover:scale-[1.03] [&.text-destructive]:hover:bg-destructive/10 [&.text-destructive]:aria-expanded:bg-destructive/10 text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "hover:scale-[1.03] bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        link: "rounded-md text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:decoration-foreground",
      },
      size: {
        default:
          "h-(--control-height-default) max-sm:h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-(--control-height-xs) max-sm:h-11 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-(--control-height-sm) max-sm:h-11 gap-1.5 px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-(--control-height-lg) max-sm:h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-(--control-height-default) max-sm:size-11",
        "icon-xs":
          "size-(--control-height-xs) max-sm:size-11 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-(--control-height-sm) max-sm:size-11",
        "icon-lg": "size-(--control-height-lg) max-sm:size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
