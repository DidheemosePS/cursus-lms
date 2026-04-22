import ErrorMessage from "./error-message";

export interface DateInputProps {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  error?: string;
  icon: React.ReactNode;
}

export default function DateInput({
  label,
  name,
  onChange,
  disabled,
  error,
  icon,
}: DateInputProps) {
  return (
    <div className="space-y-1">
      <label
        className={`flex items-center gap-2 text-sm text-gray-600 px-3 py-1.5 rounded-lg border transition-all ${error ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100 hover:border-gray-200"}`}
      >
        {icon}
        <span className="text font-semibold uppercase text-gray-400">
          {label}
        </span>
        <input
          className="bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-dashed text-gray-700 disabled:opacity-50"
          type="date"
          name={name}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          required
        />
      </label>
      {error && <ErrorMessage text={error} />}
    </div>
  );
}
