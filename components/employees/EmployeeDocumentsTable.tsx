import React from "react";
import { Download, Trash2, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmployeeDocument } from "@/types/employee";
import { formatFileSize, DOCUMENT_TYPE_LABELS } from "@/lib/utils";

interface EmployeeDocumentsTableProps {
  documents: EmployeeDocument[];
  onDownload: (docId: string, filename: string) => Promise<void>;
  onDelete: (docId: string) => Promise<void>;
}

export const EmployeeDocumentsTable: React.FC<EmployeeDocumentsTableProps> = ({
  documents,
  onDownload,
  onDelete,
}) => {
  if (documents.length === 0) {
    return (
      <Card className="text-center py-12">
        <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
        <p className="text-body font-medium text-slate-700">No documents yet</p>
        <p className="text-caption text-secondary mt-1">
          Upload employee documents such as NIC, CV, contracts, etc.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {documents.map((doc) => (
        <Card key={doc.id} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-medium text-slate-900 truncate">
              {doc.originalFileName}
            </p>
            <p className="text-caption text-secondary">
              {DOCUMENT_TYPE_LABELS[doc.documentType]} · {formatFileSize(doc.fileSize)}
            </p>
            <p className="text-caption text-muted">
              {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => onDownload(doc.id, doc.originalFileName)}
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-danger hover:bg-danger-50"
              onClick={() => onDelete(doc.id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
