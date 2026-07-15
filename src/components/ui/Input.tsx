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
      <div className="w-full flex flex-col space-y-1">
        {label && (
          <label className="text-sm font-medium text-slate-700">
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
              flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 
              transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? "border-red-500 focus:ring-red-500" : "border-slate-300"}
              ${icon ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
