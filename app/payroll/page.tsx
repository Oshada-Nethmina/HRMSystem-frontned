"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/Card";
import { Payroll } from "@/types/payroll";
import { Employee } from "@/types/employee";
import { formatCurrency, MONTH_NAMES } from "@/lib/utils";
import api from "@/lib/api";
import { PaginatedResponse } from "@/types/auth";

const EMPTY_FORM = {
  employeeId: "",
  month: "",
  year: "",
  basicSalary: "",
  allowances: "0",
  deductions: "0",
  paymentStatus: "PENDING",
};

const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", employeeCode: "EMP001", firstName: "Amara", lastName: "Perera", email: "", phone: "", address: "", department_id: "1", position_id: "1", joiningDate: "", employmentType: "FULL_TIME", basicSalary: 3500, status: "ACTIVE", createdAt: "", updatedAt: "" },
  { id: "2", employeeCode: "EMP002", firstName: "Kasun", lastName: "Silva", email: "", phone: "", address: "", department_id: "2", position_id: "3", joiningDate: "", employmentType: "FULL_TIME", basicSalary: 2800, status: "ONBOARDING", createdAt: "", updatedAt: "" },
  { id: "3", employeeCode: "EMP003", firstName: "Nimali", lastName: "Fernando", email: "", phone: "", address: "", department_id: "3", position_id: "4", joiningDate: "", employmentType: "CONTRACT", basicSalary: 4200, status: "ACTIVE", createdAt: "", updatedAt: "" },
];

const MOCK_PAYROLLS: Payroll[] = [
  { id: "1", employeeId: "1", employee: { firstName: "Amara", lastName: "Perera", employeeCode: "EMP001" }, month: 12, year: 2024, basicSalary: 3500, allowances: 500, deductions: 200, netSalary: 3800, paymentStatus: "PAID", createdAt: "2024-12-01", updatedAt: "2024-12-01" },
  { id: "2", employeeId: "2", employee: { firstName: "Kasun", lastName: "Silva", employeeCode: "EMP002" }, month: 12, year: 2024, basicSalary: 2800, allowances: 300, deductions: 150, netSalary: 2950, paymentStatus: "PENDING", createdAt: "2024-12-01", updatedAt: "2024-12-01" },
  { id: "3", employeeId: "3", employee: { firstName: "Nimali", lastName: "Fernando", employeeCode: "EMP003" }, month: 12, year: 2024, basicSalary: 4200, allowances: 700, deductions: 300, netSalary: 4600, paymentStatus: "PENDING", createdAt: "2024-12-01", updatedAt: "2024-12-01" },
  { id: "4", employeeId: "1", employee: { firstName: "Amara", lastName: "Perera", employeeCode: "EMP001" }, month: 11, year: 2024, basicSalary: 3500, allowances: 500, deductions: 200, netSalary: 3800, paymentStatus: "PAID", createdAt: "2024-11-01", updatedAt: "2024-11-01" },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Payroll | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const fetchAll = useCallback(async () => {
    try {
      const [prRes, empRes] = await Promise.all([
        api.get<PaginatedResponse<Payroll>>("/payrolls"),
        api.get<PaginatedResponse<Employee>>("/employees"),
      ]);

      setPayrolls(prRes.data.data);
      setEmployees(empRes.data.data);
    } catch {
      setPayrolls(MOCK_PAYROLLS);
      setEmployees(MOCK_EMPLOYEES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = payrolls.filter((p) =>
    (!filterMonth || p.month === Number(filterMonth)) &&
    (!filterYear || p.year === Number(filterYear))
  );

  const totalNet = filtered.reduce((s, p) => s + p.netSalary, 0);
  const paid = filtered.filter((p) => p.paymentStatus === "PAID").length;
  const pending = filtered.filter((p) => p.paymentStatus === "PENDING").length;

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (p: Payroll) => {
    setEditing(p);
    setForm({
      employeeId: p.employeeId,
      month: String(p.month),
      year: String(p.year),
      basicSalary: String(p.basicSalary),
      allowances: String(p.allowances),
      deductions: String(p.deductions),
      paymentStatus: p.paymentStatus,
    });
    setErrors({});
    setModalOpen(true);
  };

  const netSalary = Number(form.basicSalary) + Number(form.allowances) - Number(form.deductions);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.employeeId) errs.employeeId = "Select an employee";
    if (!form.month) errs.month = "Select a month";
    if (!form.year) errs.year = "Select a year";

    if (!form.basicSalary || isNaN(Number(form.basicSalary))) {
      errs.basicSalary = "Valid salary required";
    }

    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      console.log("FORM STATE:", form);
      const emp = employees.find((e) => e.id === form.employeeId);
      const payload = {
        employeeId: form.employeeId,
        month: Number(form.month),
        year: Number(form.year),
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
        paymentStatus: form.paymentStatus,
      };
      console.log("PAYLOAD:", payload);
      if (editing) {
        await api.patch(`/payrolls/${editing.id}`, payload);
      } else {
        await api.post("/payrolls", payload);
      }
      await fetchAll();
      setModalOpen(false);
    } catch {
      const emp = employees.find((e) => e.id === form.employeeId);
      const mock: Payroll = {
        id: editing?.id || crypto.randomUUID(),
        employeeId: form.employeeId,
        employee: emp ? { firstName: emp.firstName, lastName: emp.lastName, employeeCode: emp.employeeCode } : undefined,
        month: Number(form.month), year: Number(form.year),
        basicSalary: Number(form.basicSalary), allowances: Number(form.allowances),
        deductions: Number(form.deductions), netSalary: netSalary,
        paymentStatus: form.paymentStatus as Payroll["paymentStatus"],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      if (editing) setPayrolls((prev) => prev.map((p) => p.id === editing.id ? mock : p));
      else setPayrolls((prev) => [...prev, mock]);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try { await api.delete(`/payrolls/${id}`); } catch { /* ignore */ }
    setPayrolls((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
  }));
  const monthOptions = MONTH_NAMES.map((m, i) => ({ value: String(i + 1), label: m }));
  const yearOptions = [2023, 2024, 2025, 2026].map((y) => ({ value: String(y), label: String(y) }));

  const columns = [
    {
      key: "code", header: "Code", render: (p: Payroll) => (
        <span className="font-mono text-caption font-medium text-primary bg-primary-50 px-2 py-0.5 rounded">{p.employee?.employeeCode}</span>
      )
    },
    {
      key: "employee", header: "Employee", render: (p: Payroll) => (
        <span className="font-medium text-slate-900">{p.employee?.firstName} {p.employee?.lastName}</span>
      )
    },
    { key: "period", header: "Period", render: (p: Payroll) => `${MONTH_NAMES[p.month - 1]} ${p.year}` },
    { key: "basicSalary", header: "Basic Salary", render: (p: Payroll) => formatCurrency(p.basicSalary) },
    { key: "allowances", header: "Allowances", render: (p: Payroll) => <span className="text-success">{formatCurrency(p.allowances)}</span> },
    { key: "deductions", header: "Deductions", render: (p: Payroll) => <span className="text-danger">{formatCurrency(p.deductions)}</span> },
    { key: "netSalary", header: "Net Salary", render: (p: Payroll) => <span className="font-semibold text-slate-900">{formatCurrency(p.netSalary)}</span> },
    { key: "paymentStatus", header: "Status", render: (p: Payroll) => <StatusBadge label={p.paymentStatus} /> },
    {
      key: "actions", header: "Actions", render: (p: Payroll) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(p)}>Edit</Button>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />} className="text-danger hover:bg-danger-50" onClick={() => setDeleteId(p.id)}>Delete</Button>
        </div>
      )
    },
  ];

  return (
    <DashboardLayout>
      <Navbar
        title="Payroll"
        subtitle="Manage employee compensation"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Payroll</Button>}
      />
      <div className="p-6 animate-in flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Total Net Payout" value={formatCurrency(totalNet)} icon={<DollarSign className="w-5 h-5" />} color="primary" />
          <StatCard title="Paid" value={paid} icon={<DollarSign className="w-5 h-5" />} color="success" />
          <StatCard title="Pending" value={pending} icon={<DollarSign className="w-5 h-5" />} color="warning" />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            options={[{ value: "", label: "All months" }, ...monthOptions]}
            className="w-40"
          />
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            options={[{ value: "", label: "All years" }, ...yearOptions]}
            className="w-32"
          />
          <span className="text-caption text-secondary">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <Table columns={columns} data={filtered} loading={loading} rowKey={(p) => p.id} emptyMessage="No payroll records for this period." />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Payroll" : "Create Payroll"} size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Create Payroll"}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Select label="Employee" value={form.employeeId} onChange={(e) => { const emp = employees.find((em) => em.id === e.target.value); setForm({ ...form, employeeId: e.target.value, basicSalary: emp ? String(emp.basicSalary) : form.basicSalary }); }} options={employeeOptions} placeholder="Select employee" error={errors.employeeId} required className="col-span-2" />
          <Select label="Month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} options={monthOptions} error={errors.month} />
          <Select label="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} options={yearOptions} error={errors.year} />
          <Input label="Basic Salary (USD)" type="number" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} error={errors.basicSalary} required />
          <Input label="Allowances (USD)" type="number" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} />
          <Input label="Deductions (USD)" type="number" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
          <Select label="Payment Status" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} options={[{ value: "PENDING", label: "Pending" }, { value: "PAID", label: "Paid" }, { value: "FAILED", label: "Failed" }]} />
          {netSalary > 0 && (
            <div className="col-span-2 flex items-center justify-between bg-success-50 border border-success-100 rounded-input px-4 py-3">
              <span className="text-body text-success-600 font-medium">Net Salary (auto-calculated)</span>
              <span className="text-subheading font-bold text-success">{formatCurrency(netSalary)}</span>
            </div>
          )}
          {errors.submit && <p className="col-span-2 text-caption text-danger">{errors.submit}</p>}
        </div>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Payroll" size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </div>
        }
      >
        <p className="text-body text-secondary">Are you sure you want to delete this payroll record? This cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
}
