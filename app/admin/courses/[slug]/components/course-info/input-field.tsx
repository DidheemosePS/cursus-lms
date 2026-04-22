export interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  name,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-11 p-3 rounded-lg outline-0 ring ring-gray-200 focus:ring-blue-500 bg-white text-sm"
      />
    </div>
  );
}
