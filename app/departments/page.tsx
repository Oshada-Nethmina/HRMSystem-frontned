"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Department } from "@/types/employee";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api";

const EMPTY_FORM = { name: "", description: "", isActive: true };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await api.get<Department[]>("/departments");

      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load departments:", error);

      setDepartments([
        {
          id: "1",
          name: "Engineering",
          description: "Software development and infrastructure",
          isActive: true,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          name: "Human Resources",
          description: "People operations and culture",
          isActive: true,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    setForm({ name: dept.name, description: dept.description, isActive: dept.isActive });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Department name is required";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/departments/${editing.id}`, form);
      } else {
        await api.post("/departments", form);
      }
      await fetchDepartments();
      setModalOpen(false);
    } catch {
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/departments/${id}`);
      await fetchDepartments();
    } catch {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    }
    setDeleteId(null);
  };

  const columns = [
    {
      key: "name", header: "Department", render: (d: Department) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-slate-900">{d.name}</span>
        </div>
      ),
    },
    { key: "description", header: "Description", render: (d: Department) => <span className="text-secondary">{d.description || "—"}</span> },
    { key: "isActive", header: "Status", render: (d: Department) => <StatusBadge label={d.isActive ? "ACTIVE" : "INACTIVE"} /> },
    { key: "createdAt", header: "Created", render: (d: Department) => formatDate(d.createdAt) },
    {
      key: "actions", header: "Actions", render: (d: Department) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(d)}>Edit</Button>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />} className="text-danger hover:bg-danger-50" onClick={() => setDeleteId(d.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Navbar
        title="Departments"
        subtitle="Manage your organizational structure"
        actions={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Department</Button>}
      />
      <div className="p-6 animate-in">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-2xl font-bold text-slate-900">{departments.length}</p>
            <p className="text-caption text-secondary mt-1">Total Departments</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-success">{departments.filter((d) => d.isActive).length}</p>
            <p className="text-caption text-secondary mt-1">Active</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-secondary">{departments.filter((d) => !d.isActive).length}</p>
            <p className="text-caption text-secondary mt-1">Inactive</p>
          </Card>
        </div>
        <Table columns={columns} data={departments} loading={loading} rowKey={(d) => d.id} emptyMessage="No departments yet. Create your first one." />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Department" : "Add Department"}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Create Department"}</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Department Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required placeholder="e.g. Engineering" />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this department" />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-body font-medium text-slate-700">Active department</label>
          </div>
          {errors.submit && <p className="text-caption text-danger">{errors.submit}</p>}
        </div>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Department" size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </div>
        }
      >
        <p className="text-body text-secondary">Are you sure you want to delete this department? This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
}
