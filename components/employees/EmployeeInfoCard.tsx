import React from "react";
import { Mail, Phone, MapPin, Calendar, User, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Employee } from "@/types/employee";
import { formatCurrency, formatDate } from "@/lib/utils";

interface EmployeeInfoCardProps {
  employee: Employee;
}

export const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({ employee }) => {
  const infoItems = [
    { icon: <Mail className="w-4 h-4" />, label: "Email", value: employee.email },
    { icon: <Phone className="w-4 h-4" />, label: "Phone", value: employee.phone || "—" },
    { icon: <MapPin className="w-4 h-4" />, label: "Address", value: employee.address || "—" },
    { icon: <Calendar className="w-4 h-4" />, label: "Joining Date", value: formatDate(employee.joiningDate) },
    { icon: <User className="w-4 h-4" />, label: "Employment Type", value: employee.employmentType?.replaceAll("_", " ") || "—" },
    { icon: <DollarSign className="w-4 h-4" />, label: "Basic Salary", value: formatCurrency(employee.basicSalary) },
  ];

  return (
    <Card>
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-white uppercase">
            {employee.firstName?.[0]}
            {employee.lastName?.[0]}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-heading font-bold text-slate-900">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-body text-secondary mt-0.5">
                {employee.position?.title} · {employee.department?.name}
              </p>
              <span className="font-mono text-caption text-primary bg-primary-50 px-2 py-0.5 rounded mt-2 inline-block">
                {employee.employeeCode}
              </span>
            </div>
            <StatusBadge label={employee.status} />
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 pt-5 border-t border-border">
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="mt-0.5 text-secondary shrink-0">{item.icon}</div>
            <div>
              <p className="text-caption text-secondary">{item.label}</p>
              <p className="text-body font-medium text-slate-800 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
