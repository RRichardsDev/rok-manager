import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
  const variants = {
    default: "bg-slate-800/50 border-slate-700/50",
    highlight: "bg-slate-800 border-amber-500/30",
  };

  return (
    <div
      className={`rounded-xl border backdrop-blur-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 border-b border-slate-700/50 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

