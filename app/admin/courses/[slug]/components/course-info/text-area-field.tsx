export interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full min-h-30 p-3 rounded-lg outline-0 ring ring-gray-200 focus:ring-blue-500 bg-white text-sm resize-y"
      />
    </div>
  );
}
