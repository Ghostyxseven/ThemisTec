import React from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  error: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
  info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/10",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-slate-500",
};

export function StatusBadge({ variant, children, dot }: StatusBadgeProps): React.JSX.Element {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
