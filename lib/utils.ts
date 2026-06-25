export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  NIC_ID: "NIC / ID Copy",
  PASSPORT: "Passport Copy",
  CV_RESUME: "CV / Resume",
  EDUCATION_CERTIFICATE: "Education Certificate",
  EMPLOYMENT_LETTER: "Employment Letter",
  BANK_DETAILS: "Bank Details",
  SIGNED_CONTRACT: "Signed Contract",
  OTHER: "Other",
};
