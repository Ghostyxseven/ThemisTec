import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-textPrimary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              flex h-11 w-full rounded-xl border bg-white/90 px-3 py-2 text-sm text-textPrimary shadow-sm
              transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-red-400 focus:border-red-400 focus:ring-red-500/20" : "border-slate-200"}
              ${icon ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
