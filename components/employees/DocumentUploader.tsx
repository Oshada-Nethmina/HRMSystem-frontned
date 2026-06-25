"use client";
import React, { useState } from "react";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { DOCUMENT_TYPE_LABELS } from "@/lib/utils";

const DOC_OPTIONS = Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export interface DocumentUploadItem {
  file: File;
  docType: string;
}

interface DocumentUploaderProps {
  onFilesChange: (files: DocumentUploadItem[]) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFilesChange }) => {
  const [items, setItems] = useState<DocumentUploadItem[]>([]);
  const [currentDocType, setCurrentDocType] = useState("OTHER");

  const handleNewFiles = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    
    // Add new files to the list with the currently selected document type
    const newItems = newFiles.map((file) => ({
      file,
      docType: currentDocType,
    }));
    
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    onFilesChange(updatedItems);
  };

  const removeItem = (indexToRemove: number) => {
    const updatedItems = items.filter((_, idx) => idx !== indexToRemove);
    setItems(updatedItems);
    onFilesChange(updatedItems);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-50 p-4 rounded-card border border-border">
        <h3 className="text-body font-medium text-slate-900 mb-3">Upload New Documents</h3>
        <div className="flex flex-col gap-4 mb-4">
          <Select
            label="Document Type for next upload"
            value={currentDocType}
            onChange={(e) => setCurrentDocType(e.target.value)}
            options={DOC_OPTIONS}
          />
          <FileUpload
            onFilesSelected={handleNewFiles}
            multiple={true}
            maxSizeMB={5}
          />
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-2">
          <p className="text-caption font-medium text-secondary mb-2 uppercase tracking-wide">
            Selected Documents ({items.length})
          </p>
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-border rounded-input">
                <div>
                  <p className="text-body font-medium text-slate-900">{item.file.name}</p>
                  <p className="text-caption text-secondary">{DOCUMENT_TYPE_LABELS[item.docType]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-danger hover:underline text-caption font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
