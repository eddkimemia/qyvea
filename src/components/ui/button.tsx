import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary CTA: Qyvea lime #7FAF25 with near-black text for best contrast
        default: "bg-[#7FAF25] text-black hover:bg-[#6A9A1F] shadow-sm hover:shadow-md font-semibold",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        // Outline: lime border, white bg
        outline: "border-2 border-[#7FAF25] bg-white text-[#5A7F1B] hover:bg-[#F2F9E6] hover:text-[#3F5D13] dark:border-[#7FAF25] dark:bg-transparent dark:text-[#7FAF25]",
        // Secondary: luxe black — best pairing with lime primary
        secondary: "bg-[#0A0A0A] text-white hover:bg-black border border-transparent hover:border-[#7FAF25]/30 shadow-sm",
        ghost: "hover:bg-[#F2F9E6] hover:text-[#3F5D13] text-zinc-700 dark:hover:bg-zinc-900",
        link: "text-[#5A7F1B] underline-offset-4 hover:underline hover:text-[#7FAF25]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
export { Button, buttonVariants };
