export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payroll {
  id: string;
  employeeId: string;

  employee?: {
    firstName: string;
    lastName: string;
    employeeCode: string;
  };

  month: number;
  year: number;

  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;

  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}
export interface DashboardStats {
  summary: {
    totalEmployees: number;
    activeEmployees: number;
    onboardingEmployees: number;
    totalDepartments: number;
    totalPositions: number;
    monthlyPayrollTotal: number;
    monthlyPayrollCount: number;
    pendingPayrollsCount: number;
    currentMonth: number;
    currentYear: number;
  };

  recentEmployees: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    joiningDate: string;
    department?: {
      name: string;
    };
    position?: {
      title: string;
    };
  }[];

  pendingPayrolls: Payroll[];

  charts: {
    employeesByDepartment: {
      departmentId: string;
      departmentName: string;
      count: number;
    }[];

    employeesByStatus: {
      status: string;
      count: number;
    }[];
  };
}