import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-lg hover:ring-slate-900/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
