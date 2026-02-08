import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-[var(--color-foreground)]">
                        {label}
                    </label>
                )}
                <input
                    className={cn(
                        "h-11 w-full rounded-lg border border-slate-700 bg-[var(--color-secondary)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-slate-400 focus:border-[var(--color-cta)] focus:outline-none focus:ring-1 focus:ring-[var(--color-cta)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 animate-fadeIn">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
