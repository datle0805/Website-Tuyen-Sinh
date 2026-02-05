import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl border border-slate-800 bg-[var(--color-primary)] p-6 text-[var(--color-foreground)] shadow-md",
                    hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-700 cursor-pointer",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";
