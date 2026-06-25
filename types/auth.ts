export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "HR" | "EMPLOYEE";
}

export interface AuthData {
  accessToken: string;
  user: User;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}