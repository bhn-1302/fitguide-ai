import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormField = ({ label, ...props }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <input
        {...props}
        className="h-11 rounded-[var--radius-md] border border-black/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
