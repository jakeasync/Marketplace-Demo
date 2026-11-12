import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "facebook";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#1877F2] text-white hover:bg-[#166fe5]",
    facebook: "bg-[#E7F3FF] text-[#1877F2] border border-[#1877F2]/20 font-medium",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-500 text-white",
    outline: "text-gray-950 border border-gray-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

