"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { reorder } from "./actions";
import AddNewModules from "../add-new-modules/add-new-modules";
import ModulesHeader from "./modules-header";
import ModuleCard from "./module-card";
import Warning from "@/assets/icons/warning.svg";

export interface ModulesProps {
  id: string;
  title: string;
  description: string;
  position: number;
  startDate: Date;
  dueDate: Date;
}

export default function Modules({
  modules,
}: {
  modules: Promise<ModulesProps[]>;
}) {
  // Course Id
  const { slug } = useParams<{ slug: string }>();

  // Db call
  const initialModules = use(modules);

  const [modulesData, setModulesData] =
    useState<ModulesProps[]>(initialModules);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedModules = useDebounce(modulesData, 500);

  const isFirstRender = useRef(true); // To skip first render
  const savingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // To make a small delay in reset

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!debouncedModules.length || draggedId !== null) return;

    // Function to save module order
    const saveModuleOrder = async () => {
      try {
        setIsSaving(true);

        const payload = debouncedModules.map((m) => ({
          id: m.id,
          position: m.position,
        }));

        // Call server action
        const res = await reorder(slug, payload);

        // Server action error handling
        if (!res.success) throw new Error("Failed to save module order");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong";
        setError(errorMessage);
        console.error("Error saving module order:", error);
      } finally {
        if (savingTimeoutRef.current) clearTimeout(savingTimeoutRef.current);
        savingTimeoutRef.current = setTimeout(() => {
          setIsSaving(false);
        }, 1000);
      }
    };

    saveModuleOrder();
  }, [debouncedModules, draggedId, slug]);

  // Reordering function
  const reorderModules = useCallback((dragId: string, hoverId: string) => {
    // Cancel if dragging over the same position
    if (dragId === hoverId) return;

    // Update state
    setModulesData((prev) => {
      const fromIndex = prev.findIndex((m) => m.id === dragId);
      const toIndex = prev.findIndex((m) => m.id === hoverId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
        return prev;

      // Make copy
      const updated = [...prev];
      // Removed the dragging module
      const [moved] = updated.splice(fromIndex, 1);
      // Added to hovering module
      updated.splice(toIndex, 0, moved);

      // Updated the modules position to update the db
      const reordered = updated.map((m, index) => ({
        ...m,
        position: index + 1,
      }));

      // Return boolean if there is a change
      const hasOrderChanged = prev.some((m, i) => m.id !== reordered[i]?.id);

      return hasOrderChanged ? reordered : prev;
    });
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback(
    (id: string, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (draggedId) {
        reorderModules(draggedId, id);
      }
    },
    [draggedId, reorderModules],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const moduleCount = modulesData.length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 md:p-8">
      <ModulesHeader count={moduleCount} />

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-500 text-sm">
          <Warning className="size-3 shrink-0" />
          {error}
        </div>
      )}

      {/* Saving indicator */}
      {isSaving && (
        <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-500 text-sm flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Saving changes...
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {modulesData.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            setModulesData={setModulesData}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            isDragging={draggedId === module.id}
          />
        ))}
      </div>

      <AddNewModules
        setModulesData={setModulesData}
        modulesLength={modulesData.length}
        slug={slug}
      />
    </div>
  );
}
