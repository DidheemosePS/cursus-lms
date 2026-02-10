import ErrorMessage from "./error-message";

export interface InputFieldProps {
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  error?: string;
}

const BASE_INPUT_CLASS =
  "w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-dashed disabled:opacity-50";

export default function InputField({
  name,
  placeholder,
  onChange,
  disabled,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <input
        className={`${BASE_INPUT_CLASS} font-bold text-lg text-gray-900`}
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        required
      />
      {error && <ErrorMessage text={error} />}
    </div>
  );
}
