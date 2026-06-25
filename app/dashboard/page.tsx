"use client";
import React, { useEffect, useState } from "react";
import { Users, Building2, Briefcase, DollarSign, TrendingUp, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard, Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table } from "@/components/ui/Table";
import { DashboardStats } from "@/types/payroll";
import { formatCurrency, formatDate, MONTH_NAMES } from "@/lib/utils";
import api from "@/lib/api";
import { ApiResponse } from "@/types/auth";

const MOCK_STATS: DashboardStats = {
  summary: {
    totalEmployees: 48,
    activeEmployees: 45,
    onboardingEmployees: 3,
    totalDepartments: 7,
    totalPositions: 21,
    monthlyPayrollTotal: 185400,
    monthlyPayrollCount: 48,
    pendingPayrollsCount: 3,
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
  },
  recentEmployees: [
    { id: "1", employeeCode: "EMP001", firstName: "Amara", lastName: "Perera", email: "[EMAIL_ADDRESS]", position: { title: "Software Engineer" }, department: { name: "Engineering" }, joiningDate: "2024-11-01", status: "ACTIVE" },
    { id: "2", employeeCode: "EMP002", firstName: "Kasun", lastName: "Silva", email: "[EMAIL_ADDRESS]", position: { title: "HR Coordinator" }, department: { name: "Human Resources" }, joiningDate: "2024-11-15", status: "ONBOARDING" },
    { id: "3", employeeCode: "EMP003", firstName: "Nimali", lastName: "Fernando", email: "[EMAIL_ADDRESS]", position: { title: "Product Manager" }, department: { name: "Product" }, joiningDate: "2024-12-01", status: "ACTIVE" },
    { id: "4", employeeCode: "EMP004", firstName: "Dinesh", lastName: "Rajapaksa", email: "[EMAIL_ADDRESS]", position: { title: "Data Analyst" }, department: { name: "Engineering" }, joiningDate: "2024-12-10", status: "ONBOARDING" },
  ],
  pendingPayrolls: [],

  charts: {
    employeesByDepartment: [],
    employeesByStatus: [],
  },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get<DashboardStats>("/dashboard");

        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const data = stats || MOCK_STATS;

  const recentColumns = [
    {
      key: "employeeCode", header: "Code", render: (row: typeof data.recentEmployees[0]) => (
        <span className="font-mono text-caption font-medium text-primary bg-primary-50 px-2 py-0.5 rounded">{row.employeeCode}</span>
      )
    },
    {
      key: "name", header: "Name", render: (row: typeof data.recentEmployees[0]) => (
        <span className="font-medium text-slate-900">{row.firstName} {row.lastName}</span>
      )
    },
    { key: "position", header: "Position", render: (row: typeof data.recentEmployees[0]) => row.position?.title || "—" },
    { key: "department", header: "Department", render: (row: typeof data.recentEmployees[0]) => row.department?.name || "—" },
    { key: "joining_date", header: "Joined", render: (row: typeof data.recentEmployees[0]) => formatDate(row.joiningDate) },
    { key: "status", header: "Status", render: (row: typeof data.recentEmployees[0]) => <StatusBadge label={row.status} /> },
  ];

  return (
    <DashboardLayout>
      <Navbar
        title="Dashboard"
        subtitle={`${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()} overview`}
      />
      <div className="p-6 flex flex-col gap-6 animate-in">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={loading ? "..." : data.summary.totalEmployees}
            icon={<Users className="w-5 h-5" />}
            color="primary"
          />
          <StatCard
            title="Departments"
            value={loading ? "..." : data.summary.totalDepartments}
            icon={<Building2 className="w-5 h-5" />}
            color="success"
          />
          <StatCard
            title="Positions"
            value={loading ? "..." : data.summary.totalPositions}
            icon={<Briefcase className="w-5 h-5" />}
            color="warning"
          />
          <StatCard
            title="Monthly Payroll"
            value={loading ? "..." : formatCurrency(data.summary.monthlyPayrollTotal)}
            icon={<DollarSign className="w-5 h-5" />}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="flex items-center gap-4 lg:col-span-1">
            <div className="p-3 rounded-card bg-warning-50">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="section-label text-secondary">Pending Payrolls</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? "..." : data.summary.pendingPayrollsCount}</p>
              <p className="text-caption text-secondary">Awaiting processing</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 lg:col-span-1">
            <div className="p-3 rounded-card bg-success-50">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="section-label text-secondary">Active Rate</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? "..." : `${Math.round((data.summary.totalEmployees / (data.summary.totalEmployees + data.summary.pendingPayrollsCount)) * 100)}%`}
              </p>
              <p className="text-caption text-secondary">Employee activity</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 lg:col-span-1">
            <div className="p-3 rounded-card bg-primary-50">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="section-label text-secondary">Avg. Salary</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? "..." : formatCurrency(data.summary.monthlyPayrollTotal / Math.max(data.summary.totalEmployees, 1))}
              </p>
              <p className="text-caption text-secondary">Per employee</p>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-subheading font-semibold text-slate-900">Recent Employees</h2>
              <p className="text-caption text-secondary">Latest onboarded members</p>
            </div>
          </div>
          <Table
            columns={recentColumns}
            data={data.recentEmployees}
            loading={loading}
            rowKey={(r) => r.id}
            emptyMessage="No recent employees"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
