"use client";

import Delete from "@/assets/icons/delete.svg";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteModule } from "./actions";
import { ModulesProps } from "../modules";

export default function DeleteButton({
  moduleId,
  setModulesData,
}: {
  moduleId: string;
  setModulesData: Dispatch<SetStateAction<ModulesProps[]>>;
}) {
  const { slug } = useParams<{ slug: string }>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteBtn() {
    // Add a custom pop
    if (!confirm("Are you sure you want to delete this module")) return;
    setIsDeleting(true);
    setError(null);

    try {
      // Call server action
      const res = await deleteModule(moduleId, slug);

      if (!res.success) {
        setError(res.error || "Failed to delete module");
        return;
      }

      setModulesData((prev) => prev.filter((u) => u.id !== moduleId));
    } catch (error) {
      console.error("Delete error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <div>
      <button
        onClick={handleDeleteBtn}
        disabled={isDeleting}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
        aria-label="Delete module"
        title={isDeleting ? "Deleting..." : "Delete module"}
      >
        <Delete className="size-5" />
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
