import React from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Department, Position } from "@/types/employee";

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  department_id: string;
  position_id: string;
  joining_date: string;
  employment_type: string;
  basic_salary: string;
  status: string;
}

interface EmployeeFormProps {
  form: EmployeeFormData;
  setForm: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  errors: Record<string, string>;
  departments: Department[];
  positions: Position[];
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  form,
  setForm,
  errors,
  departments,
  positions,
}) => {
  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));
  const posOptions = positions
    .filter((p) => !form.department_id || p.departmentId === form.department_id)
    .map((p) => ({ value: p.id, label: p.title }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Input
        label="First Name"
        value={form.first_name}
        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        error={errors.first_name}
        required
      />
      <Input
        label="Last Name"
        value={form.last_name}
        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        error={errors.last_name}
        required
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        required
        className="lg:col-span-2"
      />
      <Input
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="+94 71 234 5678"
      />
      <Input
        label="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <Select
        label="Department"
        value={form.department_id}
        onChange={(e) => setForm({ ...form, department_id: e.target.value, position_id: "" })}
        options={deptOptions}
        placeholder="Select department"
        error={errors.department_id}
        required
      />
      <Select
        label="Position"
        value={form.position_id}
        onChange={(e) => setForm({ ...form, position_id: e.target.value })}
        options={posOptions}
        placeholder="Select position"
        error={errors.position_id}
        required
      />
      <Input
        label="Joining Date"
        type="date"
        value={form.joining_date}
        onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
        error={errors.joining_date}
        required
      />
      <Select
        label="Employment Type"
        value={form.employment_type}
        onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
        options={[
          { value: "FULL_TIME", label: "Full Time" },
          { value: "PART_TIME", label: "Part Time" },
          { value: "CONTRACT", label: "Contract" },
          { value: "INTERN", label: "Intern" },
        ]}
      />
      <Input
        label="Basic Salary (USD)"
        type="number"
        value={form.basic_salary}
        onChange={(e) => setForm({ ...form, basic_salary: e.target.value })}
        error={errors.basic_salary}
        required
      />
      <Select
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        options={[
          { value: "ONBOARDING", label: "Onboarding" },
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" },
          { value: "TERMINATED", label: "Terminated" },
        ]}
      />
    </div>
  );
};
