import Save from "@/assets/icons/save.svg";

export interface FormActionsProps {
  onCancel: () => void;
  isSaving: boolean;
}

export default function FormActions({ onCancel, isSaving }: FormActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 ml-auto">
      <button
        type="reset"
        onClick={onCancel}
        disabled={isSaving}
        className="px-6 h-10 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm bg-white hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center gap-2 px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-sm shadow-sm hover:bg-[#135BEC]/90 transition-colors"
      >
        <Save className="size-5" />
        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
      </button>
    </div>
  );
}
