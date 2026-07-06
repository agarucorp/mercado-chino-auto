import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "ring-offset-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "btn btn-on-light",
        onDark: "btn btn-on-dark",
        onDarkSolid: "btn btn-on-dark-solid",
        outline: "btn btn-on-light",
        secondary: "btn btn-on-light",
        accent: "btn btn-on-light",
        destructive:
          "btn btn-on-light border-destructive/40 text-destructive hover:bg-destructive hover:border-destructive hover:text-destructive-foreground",
        ghost: "btn btn-on-light border-transparent hover:border-[var(--btn-border-light)]",
        link: "h-auto border-0 bg-transparent p-0 font-sans text-sm font-medium normal-case tracking-normal text-foreground underline-offset-4 hover:underline hover:bg-transparent",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-11 px-7",
        icon: "h-10 w-10 p-0",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        size: ["default", "sm", "lg", "icon"],
        className: "h-auto px-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
