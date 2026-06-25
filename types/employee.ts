export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ONBOARDING" | "TERMINATED";

export interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  departmentId: string;
  department?: Department;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department_id: string;
  position_id: string;
  department?: Department;
  position?: Position;
  joiningDate: string;
  employmentType: EmploymentType;
  basicSalary: number;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | "NIC_ID"
  | "PASSPORT"
  | "CV_RESUME"
  | "EDUCATION_CERTIFICATE"
  | "EMPLOYMENT_LETTER"
  | "BANK_DETAILS"
  | "SIGNED_CONTRACT"
  | "OTHER";

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: DocumentType;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}
