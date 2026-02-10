import Drag from "@/assets/icons/drag.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Delete from "@/assets/icons/delete.svg";
import { FieldErrors } from "./add-new-modules";
import InputField from "./input-field";
import DateInput from "./date-input";

export interface ModuleCardProps {
  index: number;
  modulesLength: number;
  isSubmitting: boolean;
  onRemove: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: FieldErrors;
}

export default function ModuleCard({
  index,
  modulesLength,
  isSubmitting,
  onRemove,
  onInputChange,
  fieldErrors,
}: ModuleCardProps) {
  const hasErrors = fieldErrors && Object.values(fieldErrors).some(Boolean);

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-sm cursor-move ${hasErrors ? "border-red-200 bg-red-50/30 hover:border-red-300" : "border-gray-200 hover:border-blue-500/30 bg-white"}`}
    >
      <Drag className="size-5 text-gray-300" />
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Module {modulesLength + index + 1}
            </span>
            <InputField
              name={`modules[${index}][title]`}
              placeholder="Title"
              onChange={onInputChange}
              disabled={isSubmitting}
              error={fieldErrors?.title}
            />
            <InputField
              name={`modules[${index}][description]`}
              placeholder="Description"
              onChange={onInputChange}
              disabled={isSubmitting}
              error={fieldErrors?.description}
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={isSubmitting}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete module"
          >
            <Delete className="size-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
          <DateInput
            label="Start:"
            name={`modules[${index}][startDate]`}
            onChange={onInputChange}
            disabled={isSubmitting}
            error={fieldErrors?.startDate}
            icon={<Calendar className="size-4.5 text-blue-500" />}
          />
          <DateInput
            label="Due:"
            name={`modules[${index}][dueDate]`}
            onChange={onInputChange}
            disabled={isSubmitting}
            error={fieldErrors?.dueDate}
            icon={<Calendar className="size-4.5 text-blue-500" />}
          />
        </div>
      </div>
    </div>
  );
}
