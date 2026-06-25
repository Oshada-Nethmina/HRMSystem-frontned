"use client";
import React from "react";
import { Bell, Search } from "lucide-react";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle, actions }) => (
  <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4">
    <div className="flex-1">
      <h1 className="text-subheading font-semibold text-slate-900">{title}</h1>
      {subtitle && <p className="text-caption text-secondary">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2">
      {actions}
      <button className="p-2 rounded-btn text-secondary hover:text-slate-900 hover:bg-slate-100 transition-colors relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
      </button>
    </div>
  </header>
);
