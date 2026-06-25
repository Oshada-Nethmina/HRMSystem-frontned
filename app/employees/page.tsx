"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Employee, Department, Position } from "@/types/employee";
import { formatCurrency, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";
import { ApiResponse, PaginatedResponse } from "@/types/auth";

const EMPTY_FORM = {
  first_name: "", last_name: "", email: "", phone: "", address: "",
  department_id: "", position_id: "", joining_date: "", employment_type: "FULL_TIME",
  basic_salary: "", status: "ONBOARDING",
};

const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", employeeCode: "EMP001", firstName: "Amara", lastName: "Perera", email: "amara@company.com", phone: "+94 71 234 5678", address: "Colombo 03", department_id: "1", position_id: "1", joiningDate: "2024-11-01", employmentType: "FULL_TIME", basicSalary: 3500, status: "ACTIVE", createdAt: "2024-11-01", updatedAt: "2024-11-01", department: { id: "1", name: "Engineering", description: "", isActive: true, createdAt: "", updatedAt: "" }, position: { id: "1", departmentId: "1", title: "Software Engineer", description: "", isActive: true, createdAt: "", updatedAt: "" } },
  { id: "2", employeeCode: "EMP002", firstName: "Kasun", lastName: "Silva", email: "kasun@company.com", phone: "+94 77 345 6789", address: "Kandy", department_id: "2", position_id: "3", joiningDate: "2024-11-15", employmentType: "FULL_TIME", basicSalary: 2800, status: "ONBOARDING", createdAt: "2024-11-15", updatedAt: "2024-11-15", department: { id: "2", name: "Human Resources", description: "", isActive: true, createdAt: "", updatedAt: "" }, position: { id: "3", departmentId: "2", title: "HR Coordinator", description: "", isActive: true, createdAt: "", updatedAt: "" } },
  { id: "3", employeeCode: "EMP003", firstName: "Nimali", lastName: "Fernando", email: "nimali@company.com", phone: "+94 76 456 7890", address: "Galle", department_id: "3", position_id: "4", joiningDate: "2024-12-01", employmentType: "CONTRACT", basicSalary: 4200, status: "ACTIVE", createdAt: "2024-12-01", updatedAt: "2024-12-01", department: { id: "3", name: "Product", description: "", isActive: true, createdAt: "", updatedAt: "" }, position: { id: "4", departmentId: "3", title: "Product Manager", description: "", isActive: true, createdAt: "", updatedAt: "" } },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [empRes, deptRes, posRes] = await Promise.all([
        api.get<PaginatedResponse<Employee>>("/employees"),
        api.get<Department[]>("/departments"),
        api.get<Position[]>("/positions"),
      ]);

      setEmployees(empRes.data.data);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      setPositions(Array.isArray(posRes.data) ? posRes.data : []);
    } catch {
      setEmployees(MOCK_EMPLOYEES);
      setDepartments([
        { id: "1", name: "Engineering", description: "", isActive: true, createdAt: "", updatedAt: "" },
        { id: "2", name: "Human Resources", description: "", isActive: true, createdAt: "", updatedAt: "" },
        { id: "3", name: "Product", description: "", isActive: true, createdAt: "", updatedAt: "" },
      ]);
      setPositions([
        { id: "1", departmentId: "1", title: "Software Engineer", description: "", isActive: true, createdAt: "", updatedAt: "" },
        { id: "3", departmentId: "2", title: "HR Coordinator", description: "", isActive: true, createdAt: "", updatedAt: "" },
        { id: "4", departmentId: "3", title: "Product Manager", description: "", isActive: true, createdAt: "", updatedAt: "" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return !q || `${e.firstName} ${e.lastName} ${e.email} ${e.employeeCode}`.toLowerCase().includes(q);
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({
      first_name: e.firstName, last_name: e.lastName, email: e.email,
      phone: e.phone, address: e.address, department_id: (e.department_id),
      position_id: (e.position_id), joining_date: e.joiningDate,
      employment_type: e.employmentType, basic_salary: String(e.basicSalary), status: e.status,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.first_name.trim()) errs.first_name = "First name is required";
    if (!form.last_name.trim()) errs.last_name = "Last name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.department_id) errs.department_id = "Select a department";
    if (!form.position_id) errs.position_id = "Select a position";
    if (!form.joining_date) errs.joining_date = "Joining date is required";
    if (!form.basic_salary || isNaN(Number(form.basic_salary))) errs.basic_salary = "Valid salary is required";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        employeeCode: `EMP${Date.now()}`, // or your own code generator

        firstName: form.first_name,
        lastName: form.last_name,

        email: form.email,
        phone: form.phone,
        address: form.address,

        departmentId: form.department_id,
        positionId: form.position_id,

        joiningDate: new Date(form.joining_date).toISOString(),

        employmentType: form.employment_type,

        basicSalary: Number(form.basic_salary),
        status: form.status,
      };
      if (editing) {
        await api.patch(`/employees/${editing.id}`, payload);
      } else {
        await api.post("/employees", payload);
      }
      await fetchAll();
      setModalOpen(false);
    } catch {
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try { await api.delete(`/employees/${id}`); } catch { /* ignore */ }
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
  };

  const deptOptions = (departments ?? []).map((d) => ({ value: d.id, label: d.name }));
  const posOptions = positions
    .filter((p) => !form.department_id || p.departmentId === form.department_id)
    .map((p) => ({ value: p.id, label: p.title }));

  const columns = [
    {
      key: "code", header: "Code", render: (e: Employee) => (
        <span className="font-mono text-caption font-medium text-primary bg-primary-50 px-2 py-0.5 rounded">{e.employeeCode}</span>
      ),
    },
    {
      key: "name", header: "Employee", render: (e: Employee) => (
        <div>
          <p className="font-medium text-slate-900">{e.firstName} {e.lastName}</p>
          <p className="text-caption text-secondary">{e.email}</p>
        </div>
      ),
    },
    { key: "department", header: "Department", render: (e: Employee) => e.department?.name || "—" },
    { key: "position", header: "Position", render: (e: Employee) => e.position?.title || "—" },
    {
      key: "employment_type",
      header: "Type",
      render: (e: Employee) => (
        <span className="text-caption text-secondary">
          {e.employmentType?.replaceAll("_", " ") || "—"}
        </span>
      ),
    },
    { key: "salary", header: "Basic Salary", render: (e: Employee) => formatCurrency(e.basicSalary) },
    { key: "joining_date", header: "Joined", render: (e: Employee) => formatDate(e.joiningDate) },
    { key: "status", header: "Status", render: (e: Employee) => <StatusBadge label={e.status} /> },
    {
      key: "actions", header: "Actions", render: (e: Employee) => (
        <div className="flex items-center gap-1">
          <Link href={`/employees/${e.id}`}>
            <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>View</Button>
          </Link>
          <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(e)}>Edit</Button>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />} className="text-danger hover:bg-danger-50" onClick={() => setDeleteId(e.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Navbar
        title="Employees"
        subtitle="Manage your workforce"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Employee</Button>}
      />
      <div className="p-6 animate-in flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {(["ACTIVE", "ONBOARDING", "INACTIVE", "TERMINATED"] as const).map((s) => (
            <div key={s} className="bg-white rounded-card border border-border p-4 text-center shadow-card">
              <p className="text-2xl font-bold text-slate-900">{employees.filter((e) => e.status === s).length}</p>
              <div className="flex justify-center mt-1"><StatusBadge label={s} dot={false} /></div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-input border border-border bg-white text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <span className="text-caption text-secondary">{filtered.length} employee{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <Table columns={columns} data={filtered} loading={loading} rowKey={(e) => e.id} emptyMessage="No employees found." />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Employee" : "Add Employee"} size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Create Employee"}</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} error={errors.first_name} required />
          <Input label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} error={errors.last_name} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required className="col-span-2" />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 71 234 5678" />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Select label="Department" value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value, position_id: "" })} options={deptOptions} placeholder="Select department" error={errors.department_id} required />
          <Select label="Position" value={form.position_id} onChange={(e) => setForm({ ...form, position_id: e.target.value })} options={posOptions} placeholder="Select position" error={errors.position_id} required />
          <Input label="Joining Date" type="date" value={form.joining_date} onChange={(e) => setForm({ ...form, joining_date: e.target.value })} error={errors.joining_date} required />
          <Select label="Employment Type" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })} options={[{ value: "FULL_TIME", label: "Full Time" }, { value: "PART_TIME", label: "Part Time" }, { value: "CONTRACT", label: "Contract" }, { value: "INTERN", label: "Intern" }]} />
          <Input label="Basic Salary (USD)" type="number" value={form.basic_salary} onChange={(e) => setForm({ ...form, basic_salary: e.target.value })} error={errors.basic_salary} required />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ value: "ONBOARDING", label: "Onboarding" }, { value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }, { value: "TERMINATED", label: "Terminated" }]} />
          {errors.submit && <p className="col-span-2 text-caption text-danger">{errors.submit}</p>}
        </div>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Remove Employee" size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Remove</Button>
          </div>
        }
      >
        <p className="text-body text-secondary">Are you sure you want to remove this employee? All related records will be affected.</p>
      </Modal>
    </DashboardLayout>
  );
}
