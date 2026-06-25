"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserCircle, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { authService } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "HR",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.full_name.trim()) errs.full_name = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    try {
      await authService.register({
        name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role as "ADMIN" | "HR" | "EMPLOYEE",
      });
      router.push("/login");
    } catch (err: any) {
      const message = err.response?.data?.message;

      setErrors({
        submit: Array.isArray(message)
          ? message.join(", ")
          : message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar via-slate-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-sm text-white/60 mt-1">Set up your HRM access</p>
        </div>

        <div className="bg-white rounded-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={form.full_name}
                onChange={update("full_name")}
                leftAddon={<User className="w-4 h-4" />}
                error={errors.full_name}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={update("email")}
                leftAddon={<Mail className="w-4 h-4" />}
                error={errors.email}
                required
              />
              <Select
                label="Role"
                value={form.role}
                onChange={update("role")}
                options={[
                  { value: "ADMIN", label: "Administrator" },
                  { value: "HR", label: "HR Manager" },
                  { value: "EMPLOYEE", label: "Employee" },
                ]}
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={update("password")}
                leftAddon={<Lock className="w-4 h-4" />}
                rightAddon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-secondary hover:text-slate-700">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                leftAddon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword}
                required
              />

              {errors.submit && (
                <div className="bg-danger-50 border border-danger-100 text-danger text-body rounded-input px-4 py-3">
                  {errors.submit}
                </div>
              )}

              <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
                Create Account
              </Button>
            </div>
          </form>

          <p className="text-center text-body text-secondary mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
