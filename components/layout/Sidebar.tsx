"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Briefcase, DollarSign,
  LogOut, ChevronRight, UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/departments", label: "Departments", icon: Building2 },
  { href: "/positions", label: "Positions", icon: Briefcase },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/payroll", label: "Payroll", icon: DollarSign },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar bg-sidebar shadow-sidebar flex flex-col z-30">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-body font-bold text-white leading-tight">HRM System</p>
            <p className="text-caption text-white/40">Human Resources</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="section-label text-white/30 px-3 mb-3">Main Menu</p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-btn text-body font-medium transition-all duration-150",
                    active
                      ? "bg-primary text-white"
                      : "text-white/60 hover:bg-sidebar-hover hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => authService.logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn text-body font-medium text-white/60 hover:bg-sidebar-hover hover:text-white transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
