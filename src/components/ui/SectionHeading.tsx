import React from "react";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function SectionHeading({ className = "", children, ...props }: SectionHeadingProps) {
  return (
    <h2
      className={`text-2xl font-bold tracking-tight text-slate-900 md:text-3xl ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}
