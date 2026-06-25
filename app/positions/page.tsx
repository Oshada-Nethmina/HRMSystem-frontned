"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Position, Department } from "@/types/employee";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

const EMPTY_FORM = {
  title: "",
  description: "",
  departmentId: "",
  isActive: true,
};

const MOCK_DEPTS: Department[] = [
  { id: "1", name: "Engineering", description: "", isActive: true, createdAt: "", updatedAt: "" },
  { id: "2", name: "Human Resources", description: "", isActive: true, createdAt: "", updatedAt: "" },
  { id: "3", name: "Product", description: "", isActive: true, createdAt: "", updatedAt: "" },
  { id: "4", name: "Finance", description: "", isActive: true, createdAt: "", updatedAt: "" },
];

const MOCK_POSITIONS: Position[] = [
  { id: "1", departmentId: "1", title: "Software Engineer", description: "Full-stack development", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01", department: MOCK_DEPTS[0] },
  { id: "2", departmentId: "1", title: "DevOps Engineer", description: "Infrastructure and CI/CD", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01", department: MOCK_DEPTS[0] },
  { id: "3", departmentId: "2", title: "HR Coordinator", description: "Recruitment and HR ops", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01", department: MOCK_DEPTS[1] },
  { id: "4", departmentId: "3", title: "Product Manager", description: "Product roadmap and strategy", isActive: false, createdAt: "2024-01-01", updatedAt: "2024-01-01", department: MOCK_DEPTS[2] },
];

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [posRes, deptRes] = await Promise.all([
        api.get<Position[]>("/positions"),
        api.get<Department[]>("/departments"),
      ]);
      setPositions(posRes.data);
      setDepartments(deptRes.data);
    } catch {
      setPositions(MOCK_POSITIONS);
      setDepartments(MOCK_DEPTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (p: Position) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, departmentId: String(p.departmentId), isActive: p.isActive });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Position title is required";
    if (!form.departmentId) errs.departmentId = "Please select a department";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, departmentId: form.departmentId };
      if (editing) await api.patch(`/positions/${editing.id}`, payload);
      else await api.post("/positions", payload);
      await fetchAll();
      setModalOpen(false);
    } catch {
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/positions/${id}`);
    } catch {
      // ignore
    }
    setPositions((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  const columns = [
    {
      key: "title", header: "Position", render: (p: Position) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-warning-600" />
          </div>
          <span className="font-medium text-slate-900">{p.title}</span>
        </div>
      ),
    },
    {
      key: "department", header: "Department", render: (p: Position) => (
        <span className="text-body text-secondary">{p.department?.name || departments.find((d) => d.id === p.departmentId)?.name || "—"}</span>
      )
    },
    { key: "description", header: "Description", render: (p: Position) => <span className="text-secondary">{p.description || "—"}</span> },
    { key: "is_active", header: "Status", render: (p: Position) => <StatusBadge label={p.isActive ? "ACTIVE" : "INACTIVE"} /> },
    { key: "created_at", header: "Created", render: (p: Position) => formatDate(p.createdAt) },
    {
      key: "actions", header: "Actions", render: (p: Position) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(p)}>Edit</Button>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />} className="text-danger hover:bg-danger-50" onClick={() => setDeleteId(p.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Navbar
        title="Positions"
        subtitle="Define roles across your departments"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Position</Button>}
      />
      <div className="p-6 animate-in">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-2xl font-bold text-slate-900">{positions.length}</p>
            <p className="text-caption text-secondary mt-1">Total Positions</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-success">{positions.filter((p) => p.isActive).length}</p>
            <p className="text-caption text-secondary mt-1">Active</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-secondary">{positions.filter((p) => !p.isActive).length}</p>
            <p className="text-caption text-secondary mt-1">Inactive</p>
          </Card>
        </div>
        <Table columns={columns} data={positions} loading={loading} rowKey={(p) => p.id} emptyMessage="No positions yet. Add your first position." />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Position" : "Add Position"}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Create Position"}</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Position Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} required placeholder="e.g. Software Engineer" />
          <Select label="Department" value={form.departmentId} onChange={(e) => { console.log("Selected department:", e.target.value);; setForm({ ...form, departmentId: e.target.value }) }} options={deptOptions} placeholder="Select a department" error={errors.departmentId} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this role" />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pos_active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded text-primary" />
            <label htmlFor="pos_active" className="text-body font-medium text-slate-700">Active position</label>
          </div>
          {errors.submit && <p className="text-caption text-danger">{errors.submit}</p>}
        </div>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Position" size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </div>
        }
      >
        <p className="text-body text-secondary">Are you sure you want to delete this position? This cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
}
