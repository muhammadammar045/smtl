import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
                secondary:
                    "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[color-mix(in srgb, var(--secondary) 90%, transparent)]",
                destructive:
                    "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[color-mix(in srgb, var(--destructive) 90%, transparent)]",
                success:
                    "border-transparent bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[color-mix(in srgb, var(--success) 90%, transparent)]",
                outline:
                    "text-foreground hover:bg-accent hover:text-accent-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot='badge'
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
