export interface DateInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  ariaLabel: string;
}

export default function DateInput({
  icon,
  label,
  value,
  ariaLabel,
}: DateInputProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
      {icon}
      <span className="text font-semibold uppercase text-gray-400">
        {label}
      </span>
      <input
        className="bg-transparent border-none p-0 text-sm focus:outline-dashed focus:ring-0 text-gray-700"
        type="date"
        defaultValue={value}
        aria-label={ariaLabel}
      />
    </label>
  );
}
