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
    const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-primary text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-100",
      accent: "bg-accent text-accent-foreground shadow-md hover:opacity-90 transition-opacity",
      outline: "border border-slate-300 bg-transparent shadow-sm hover:bg-slate-100 text-slate-700",
      ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
      glass: "glass-panel text-slate-900 hover:bg-slate-50/50",
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
