import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export const Card: React.FC<CardProps> = ({ children, className, padding = "md" }) => (
  <div className={cn("bg-white rounded-card border border-border shadow-card", paddingClasses[padding], className)}>
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: "primary" | "success" | "warning" | "danger";
}

const colorMap = {
  primary: "bg-primary-50 text-primary",
  success: "bg-success-50 text-success",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger",
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = "primary" }) => (
  <Card className="hover:shadow-card-hover transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="section-label text-secondary">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {trend && (
          <p className="text-caption text-secondary mt-1">
            <span className={trend.value >= 0 ? "text-success" : "text-danger"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>{" "}
            {trend.label}
          </p>
        )}
      </div>
      <div className={cn("p-3 rounded-card", colorMap[color])}>{icon}</div>
    </div>
  </Card>
);
