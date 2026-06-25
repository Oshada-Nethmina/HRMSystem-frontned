import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body font-medium text-slate-700">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 text-secondary pointer-events-none">{leftAddon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-input border bg-white text-body text-slate-900",
              "placeholder:text-muted transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:bg-slate-50 disabled:text-secondary disabled:cursor-not-allowed",
              error ? "border-danger focus:ring-danger" : "border-border hover:border-slate-400",
              leftAddon ? "pl-10 pr-3 py-2.5" : "px-3 py-2.5",
              rightAddon ? "pr-10" : "",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 text-secondary">{rightAddon}</div>
          )}
        </div>
        {error && <p className="text-caption text-danger">{error}</p>}
        {hint && !error && <p className="text-caption text-secondary">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
