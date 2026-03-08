import React from "react";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ className = "", children, ...props }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-8 lg:py-12 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
