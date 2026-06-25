"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmployeeForm, EmployeeFormData } from "@/components/employees/EmployeeForm";
import { DocumentUploader, DocumentUploadItem } from "@/components/employees/DocumentUploader";
import { Department, Position } from "@/types/employee";
import { PaginatedResponse } from "@/types/auth";
import api from "@/lib/api";

const EMPTY_FORM: EmployeeFormData = {
  first_name: "", last_name: "", email: "", phone: "", address: "",
  department_id: "", position_id: "", joining_date: "", employment_type: "FULL_TIME",
  basic_salary: "", status: "ONBOARDING",
};

export default function CreateEmployeePage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [form, setForm] = useState<EmployeeFormData>(EMPTY_FORM);
  const [uploadItems, setUploadItems] = useState<DocumentUploadItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchDependencies = useCallback(async () => {
    try {
      const [deptRes, posRes] = await Promise.all([
        api.get<Department[]>("/departments"),
        api.get<Position[]>("/positions"),
      ]);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      setPositions(Array.isArray(posRes.data) ? posRes.data : []);
    } catch (error) {
      console.error("Failed to load departments/positions", error);
    }
  }, []);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

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
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setErrors({});
    
    try {
      // 1. Create the employee
      const payload = {
        ...form,
        department_id: Number(form.department_id),
        position_id: Number(form.position_id),
        basic_salary: Number(form.basic_salary),
      };
      
      const empRes = await api.post("/employees", payload);
      // Extract ID from response based on backend structure
      // Support both { data: { id } } and { id } styles
      const newEmpId = empRes.data?.data?.id || empRes.data?.id;

      // 2. Upload documents if any
      if (newEmpId && uploadItems.length > 0) {
        for (const item of uploadItems) {
          const fd = new FormData();
          fd.append("file", item.file);
          fd.append("documentType", item.docType);
          // Backend expects file and documentType based on the DTO
          await api.post(`/employees/${newEmpId}/documents`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      // 3. Navigate back to employee list
      router.push("/employees");
      
    } catch (err: any) {
      const msg = err.response?.data?.message?.[0] || err.response?.data?.message || "Failed to save employee. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Navbar
        title="Onboard New Employee"
        subtitle="Add employee details and upload required documents"
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.back()}>
            Back
          </Button>
        }
      />
      
      <div className="p-6 animate-in flex flex-col gap-6 max-w-5xl mx-auto">
        {errors.submit && (
          <div className="bg-danger-50 border border-danger-100 text-danger text-body rounded-input px-4 py-3">
            {errors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <Card>
              <h2 className="text-subheading font-semibold text-slate-900 mb-4 border-b border-border pb-3">
                Employee Information
              </h2>
              <EmployeeForm
                form={form}
                setForm={setForm}
                errors={errors}
                departments={departments}
                positions={positions}
              />
            </Card>
          </div>
          
          <div className="xl:col-span-1 flex flex-col gap-6">
            <Card>
              <h2 className="text-subheading font-semibold text-slate-900 mb-4 border-b border-border pb-3">
                Document Upload
              </h2>
              <p className="text-caption text-secondary mb-4">
                Upload NIC, CV, or other required onboarding documents. You can upload multiple files.
              </p>
              <DocumentUploader onFilesChange={setUploadItems} />
            </Card>
            
            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                className="w-full shadow-lg"
                leftIcon={<UserPlus className="w-5 h-5" />}
                onClick={handleSave}
                loading={saving}
              >
                Complete Onboarding
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
