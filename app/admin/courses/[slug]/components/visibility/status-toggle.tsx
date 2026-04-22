export interface StatusToggleProps {
  isActive: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function StatusToggle({
  isActive,
  isLoading,
  onToggle,
}: StatusToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">Active Status</span>
        <span className="text-xs text-gray-500">
          Course is visible to learners & Instructors
        </span>
      </div>
      <button
        onClick={onToggle}
        disabled={isLoading}
        className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
          isActive ? "bg-blue-500 shadow-md" : "bg-gray-300 shadow-inner"
        } active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isActive ? "Deactivate course" : "Activate course"}
        type="button"
      >
        <div
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white border transition-all duration-200 ${isActive ? "translate-x-6 border-blue-500 shadow-lg" : "translate-x-0 border-gray-300 shadow"}`}
        />
      </button>
    </div>
  );
}
