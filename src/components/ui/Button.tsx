import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

  const variants = {
    primary:
      "bg-accent text-white shadow-glow hover:-translate-y-0.5 hover:bg-accent-hover hover:brightness-110",
    secondary:
      "bg-primary text-white shadow-soft hover:-translate-y-0.5 hover:bg-primary-dark hover:brightness-110",
    outline:
      "border border-slate-200 bg-white text-primary shadow-sm hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
    ghost:
      "text-textSecondary hover:-translate-y-0.5 hover:bg-slate-100 hover:text-textPrimary",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};
