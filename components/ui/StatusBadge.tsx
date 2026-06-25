import React from "react";
import { cn } from "@/lib/utils";

type StatusVariant = "success" | "danger" | "warning" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  dot?: boolean;
}

const STATUS_MAP: Record<string, StatusVariant> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  ONBOARDING: "info",
  TERMINATED: "danger",
  PAID: "success",
  PENDING: "warning",
  FAILED: "danger",
  true: "success",
  false: "neutral",
};

const variantClasses: Record<StatusVariant, string> = {
  success: "bg-success-50 text-success-600 border-success-100",
  danger: "bg-danger-50 text-danger border-danger-100",
  warning: "bg-warning-50 text-warning-600 border-warning-100",
  info: "bg-primary-50 text-primary border-primary-100",
  neutral: "bg-slate-100 text-secondary border-slate-200",
};

const dotClasses: Record<StatusVariant, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-primary",
  neutral: "bg-secondary",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant, dot = true }) => {
  const resolvedVariant = variant || STATUS_MAP[label] || "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-medium border",
        variantClasses[resolvedVariant]
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClasses[resolvedVariant])} />}
      {label.replace(/_/g, " ")}
    </span>
  );
};
