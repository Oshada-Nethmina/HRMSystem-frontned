"use client";
import React, { useCallback, useId, useState } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  label?: string;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const TYPE_LABELS = ["PDF", "JPG", "JPEG", "PNG"];

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 5,
  multiple = true,
  label,
}) => {
  // useId() generates a stable, unique ID per component instance — prevents
  // DOM conflicts when multiple FileUpload components exist on the same page.
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (incoming: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errs: string[] = [];
    for (const file of incoming) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.push(`${file.name}: unsupported type (allowed: ${TYPE_LABELS.join(", ")})`);
      } else if (file.size > maxSizeMB * 1024 * 1024) {
        errs.push(`${file.name}: exceeds ${maxSizeMB}MB limit`);
      } else {
        valid.push(file);
      }
    }
    return { valid, errors: errs };
  };

  const handleFiles = useCallback(
    (incoming: File[]) => {
      const { valid, errors: errs } = validateFiles(incoming);
      const next = multiple ? [...files, ...valid] : valid.slice(0, 1);
      setFiles(next);
      setErrors(errs);
      onFilesSelected(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, onFilesSelected]
  );

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFilesSelected(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-body font-medium text-slate-700">{label}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          "border-2 border-dashed rounded-card p-8 text-center transition-colors duration-150 cursor-pointer",
          dragOver
            ? "border-primary bg-primary-50"
            : "border-border hover:border-primary hover:bg-primary-50"
        )}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <Upload className={cn("w-8 h-8 mx-auto mb-3", dragOver ? "text-primary" : "text-muted")} />
        <p className="text-body font-medium text-slate-700">
          Drop files here or <span className="text-primary">browse</span>
        </p>
        <p className="text-caption text-secondary mt-1">
          Supported: {TYPE_LABELS.join(", ")} — Max {maxSizeMB}MB per file
        </p>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        />
      </div>

      {errors.length > 0 && (
        <div className="flex flex-col gap-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-caption text-danger">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-surface border border-border rounded-input"
            >
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-caption text-secondary">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 rounded text-secondary hover:text-danger hover:bg-danger-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
