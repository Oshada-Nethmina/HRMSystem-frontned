import React from "react";

interface FormWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({ title, description, children, onSubmit }) => (
  <form onSubmit={onSubmit} noValidate>
    {(title || description) && (
      <div className="mb-6">
        {title && <h3 className="text-subheading font-semibold text-slate-900">{title}</h3>}
        {description && <p className="text-body text-secondary mt-1">{description}</p>}
      </div>
    )}
    {children}
  </form>
);
