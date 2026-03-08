import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
}

export function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-300 cursor-default";
  
  const variants = {
    default: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100",
    secondary: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10 hover:bg-purple-100",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
