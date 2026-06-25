import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data?: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
}

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found",
  rowKey,
}: TableProps<T>) {

  const rows = Array.isArray(data) ? data : [];
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white shadow-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-left section-label text-secondary", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-secondary">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-body">Loading...</span>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <p className="text-body text-secondary">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border last:border-0 hover:bg-slate-50 transition-colors duration-100"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-body text-slate-700", col.className)}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
