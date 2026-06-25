import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm",
  secondary: "bg-white text-slate-700 border border-border hover:bg-slate-50 focus:ring-slate-300",
  danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger shadow-sm",
  ghost: "text-secondary hover:bg-slate-100 focus:ring-slate-300",
  success: "bg-success text-white hover:bg-green-700 focus:ring-green-400 shadow-sm",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-caption font-medium gap-1.5",
  md: "px-4 py-2 text-body font-medium gap-2",
  lg: "px-5 py-2.5 text-subheading font-semibold gap-2.5",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-btn transition-all duration-150",
      "focus:outline-none focus:ring-2 focus:ring-offset-1",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <Loader2 className="animate-spin w-4 h-4 shrink-0" />
    ) : leftIcon ? (
      <span className="shrink-0">{leftIcon}</span>
    ) : null}
    {children}
    {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
  </button>
);
