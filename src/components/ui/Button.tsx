import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "glass" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-slate-100 text-slate-900 shadow hover:bg-slate-200",
      accent: "bg-accent text-accent-foreground shadow hover:opacity-90",
      outline: "border border-slate-700 bg-transparent shadow-sm hover:bg-slate-800 hover:text-slate-50",
      ghost: "hover:bg-slate-800 hover:text-slate-50",
      glass: "glass-panel text-slate-50 hover:bg-white/10",
    };

    const sizes = {
      default: "h-11 px-6 py-3", // Standard touch target, p-3 represents 12px
      sm: "h-9 px-4 text-xs",
      lg: "h-12 px-8",
      icon: "h-11 w-11",
    };

    return (
      <button
        className={cn(baseClass, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
