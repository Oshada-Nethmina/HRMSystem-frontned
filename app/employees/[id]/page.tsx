"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Download, Trash2, FileText, User, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileUpload } from "@/components/ui/FileUpload";
import { Employee, EmployeeDocument } from "@/types/employee";
import { EmployeeInfoCard } from "@/components/employees/EmployeeInfoCard";
import { EmployeeDocumentsTable } from "@/components/employees/EmployeeDocumentsTable";
import { formatCurrency, formatDate, formatFileSize, DOCUMENT_TYPE_LABELS } from "@/lib/utils";
import api from "@/lib/api";

const MOCK_EMPLOYEE: Employee = {
  id: "1", employeeCode: "EMP001", firstName: "Amara", lastName: "Perera",
  email: "amara@company.com", phone: "+94 71 234 5678", address: "Colombo 03",
  department_id: "1", position_id: "1", joiningDate: "2024-11-01",
  employmentType: "FULL_TIME", basicSalary: 3500, status: "ACTIVE",
  createdAt: "2024-11-01", updatedAt: "2024-11-01",
  department: { id: "1", name: "Engineering", description: "", isActive: true, createdAt: "", updatedAt: "" },
  position: { id: "1", departmentId: "1", title: "Software Engineer", description: "", isActive: true, createdAt: "", updatedAt: "" },
};

const MOCK_DOCS: EmployeeDocument[] = [
  {
    id: "1",
    employeeId: "1",
    documentType: "NIC_ID",
    originalFileName: "nic_copy.pdf",
    storedFileName: "emp1_nic.pdf",
    filePath: "/uploads/emp1_nic.pdf",
    fileSize: 204800,
    mimeType: "application/pdf",
    uploadedBy: "1",
    uploadedAt: "2024-11-05T10:30:00Z",
  },
  {
    id: "2",
    employeeId: "1",
    documentType: "CV_RESUME",
    originalFileName: "amara_cv.pdf",
    storedFileName: "emp1_cv.pdf",
    filePath: "/uploads/emp1_cv.pdf",
    fileSize: 512000,
    mimeType: "application/pdf",
    uploadedBy: "1",
    uploadedAt: "2024-11-05T10:35:00Z",
  },
];

const DOC_OPTIONS = Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState("OTHER");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [empRes, docRes] = await Promise.all([
        api.get<Employee>(`/employees/${id}`),
        api.get<EmployeeDocument[]>(`/employees/${id}/documents`),
      ]);

      console.log("EMP RESPONSE:", empRes.data);
      console.log("DOC RESPONSE:", docRes);
      console.log("DOC DATA:", docRes.data);
      setEmployee(empRes.data);
      setDocuments(docRes.data);
      console.log(docRes.data);
    } catch {
      setEmployee(MOCK_EMPLOYEE);
      setDocuments(MOCK_DOCS);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpload = async () => {
    if (!uploadFiles.length) { setUploadError("Please select at least one file."); return; }
    setUploading(true);
    setUploadError("");
    try {
      for (const file of uploadFiles) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("documentType", docType);
        await api.post(`/employees/${id}/documents`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      await fetchData();
      setUploadModalOpen(false);
      setUploadFiles([]);
    } catch {
      // mock: add to local state
      const mock: EmployeeDocument = {
        id: crypto.randomUUID(),
        employeeId: String(id),
        documentType: docType as EmployeeDocument["documentType"],

        originalFileName: uploadFiles[0].name,
        storedFileName: uploadFiles[0].name,
        filePath: "/uploads/" + uploadFiles[0].name,
        fileSize: uploadFiles[0].size,
        mimeType: uploadFiles[0].type,

        uploadedBy: "1",
        uploadedAt: new Date().toISOString(),
      };
      setDocuments((prev) => [...prev, mock]);
      setUploadModalOpen(false);
      setUploadFiles([]);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try { await api.delete(`/employees/documents/${docId}`); } catch { /* ignore */ }
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const res = await api.get(`/employees/documents/${docId}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download not available in demo mode.");
    }
  };

  if (loading) return (
    <DashboardLayout>
      <Navbar title="Employee Details" />
      <div className="p-6 text-center text-secondary text-body">Loading...</div>
    </DashboardLayout>
  );

  if (!employee) return (
    <DashboardLayout>
      <Navbar title="Employee Details" />
      <div className="p-6 text-center text-secondary text-body">Employee not found.</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <Navbar
        title="Employee Details"
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.back()}>
            Back
          </Button>
        }
      />
      <div className="p-6 animate-in flex flex-col gap-6">
        <EmployeeInfoCard employee={employee} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-subheading font-semibold text-slate-900">Documents</h3>
              <p className="text-caption text-secondary">{documents.length} file{documents.length !== 1 ? "s" : ""} uploaded</p>
            </div>
            <Button leftIcon={<Upload className="w-4 h-4" />} onClick={() => { setUploadModalOpen(true); setUploadError(""); setUploadFiles([]); setDocType("OTHER"); }}>
              Upload Document
            </Button>
          </div>

          <EmployeeDocumentsTable
            documents={documents}
            onDownload={handleDownload}
            onDelete={handleDeleteDoc}
          />
        </div>
      </div>

      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload Document" size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} loading={uploading} leftIcon={<Upload className="w-4 h-4" />}>Upload</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <Select
            label="Document Type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            options={DOC_OPTIONS}
          />
          <FileUpload
            label="Select Files"
            onFilesSelected={setUploadFiles}
            multiple
            maxSizeMB={5}
          />
          {uploadError && <p className="text-caption text-danger">{uploadError}</p>}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
