import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--color-cta)] text-white hover:opacity-90 shadow-md",
            secondary: "bg-[var(--color-secondary)] text-[var(--color-text)] hover:bg-[var(--color-secondary)]/80 shadow-sm",
            outline: "bg-transparent border-2 border-[var(--color-foreground)] text-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/10",
            ghost: "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/10",
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg",
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta)] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
