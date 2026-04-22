"use client";

import Tick from "@/assets/icons/circle-tick.svg";
import Plus from "@/assets/icons/plus.svg";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { modulesFormSchema } from "@/lib/validation/modules";
import { parseFormToArray } from "@/utils/parse-form-to-array";
import { createModule } from "./actions";
import ErrorMessage from "./error-message";
import ModuleCard from "./module-card";
import z from "zod";
import { ModulesProps } from "../modules/modules";

export type FieldErrors = Record<string, string | undefined>;

interface UIErrors {
  addNewModuleWarning?: string;
  submitError?: string;
  fieldErrors?: FieldErrors;
}

export default function AddNewModules({
  setModulesData,
  modulesLength,
  slug,
}: {
  setModulesData: Dispatch<SetStateAction<ModulesProps[]>>;
  modulesLength: number;
  slug: string;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [drafts, setDrafts] = useState<{ id: string }[]>([]); // Store all new modules Id
  const [errors, setErrors] = useState<UIErrors>({}); // Error State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const checkAllFieldsFilled = useCallback(() => {
    if (drafts.length === 0) return false;

    return drafts.every((_, index) => {
      const title = formData[`modules[${index}][title]`]?.trim();
      const description = formData[`modules[${index}][description]`]?.trim();
      const startDate = formData[`modules[${index}][startDate]`];
      const dueDate = formData[`modules[${index}][dueDate]`];

      return !!(title && description && startDate && dueDate);
    });
  }, [drafts, formData]);

  // Convert Zod errors based on input fields
  const parseZodErrors = useCallback((error: z.ZodError): FieldErrors => {
    const fieldErrors: FieldErrors = {};

    error.issues.forEach((issue) => {
      const path = issue.path[1] as string;
      if (path) {
        fieldErrors[path] = issue.message;
      }
    });

    return fieldErrors;
  }, []);

  const handleAddNewModulesBtn = useCallback(() => {
    if (drafts.length > 0 && !checkAllFieldsFilled()) {
      setErrors({
        addNewModuleWarning:
          "Please fill all fields in the current module before adding a new one.",
      });
      return;
    }

    setErrors({});
    setDrafts((prev) => [...prev, { id: crypto.randomUUID() }]);
  }, [checkAllFieldsFilled, drafts.length]);

  // Handle Submit
  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setIsSubmitting(true);

      try {
        // Call parseFormToArray function to reconstruct the structure
        const modules = parseFormToArray(formData);

        // Validate the formdata with zod modules schema
        const parsed = modulesFormSchema.safeParse(modules);

        // Zod Error handling
        if (!parsed.success) {
          const fieldErrors = parseZodErrors(parsed.error);
          setErrors((prev) => ({
            ...prev,
            fieldErrors,
          }));
          return;
        }

        // Call the server action to save the new modules to DB
        const res = await createModule(slug, parsed.data);

        // Sever action error handling
        if (!res.success) {
          setErrors((prev) => ({
            ...prev,
            submitError: res.error ?? "Something went wrong",
          }));
          return;
        }

        // Store new modules to existing modules
        setModulesData((prev) => [...prev, ...(res.modules ?? [])]);
        // State reset
        setDrafts([]);
        setFormData({});
        setErrors({});
      } catch (error) {
        console.error("Submit error:", error);
        setErrors((prev) => ({
          ...prev,
          submitError: "An unexpected error occurred. Please try again",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [parseZodErrors, setModulesData, slug],
  );

  const allFieldsFilled = checkAllFieldsFilled();
  const showWarning = drafts.length > 0 && !allFieldsFilled;
  const isAddButtonDisabled = showWarning || isSubmitting;

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {drafts.map((draft, index) => {
        return (
          <ModuleCard
            key={draft.id}
            index={index}
            modulesLength={modulesLength}
            isSubmitting={isSubmitting}
            onRemove={() =>
              setDrafts((prev) => prev.filter((m) => m.id !== draft.id))
            }
            onInputChange={handleInputChange}
            fieldErrors={errors.fieldErrors}
          />
        );
      })}

      {showWarning && (
        <ErrorMessage text="Please fill the current module before adding a new one." />
      )}

      {errors.submitError && <ErrorMessage text={errors.submitError} />}

      <div className="flex gap-4">
        <button
          type="button"
          disabled={isAddButtonDisabled}
          onClick={handleAddNewModulesBtn}
          className="flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 font-bold not-disabled:hover:border-blue-500 not-disabled:hover:text-blue-500 not-disabled:hover:bg-blue-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add new module"
        >
          <span className="p-0.5 border rounded-full">
            <Plus className="size-5" />
          </span>
          <span>Add New Module</span>
        </button>

        {drafts.length > 0 && (
          <button
            type="submit"
            disabled={isSubmitting || !allFieldsFilled}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-blue-500 text-white font-bold not-disabled:hover:border-blue-500 not-disabled:hover:text-blue-500 not-disabled:hover:bg-blue-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed not-disabled:cursor-pointer"
            aria-label="Save all modules"
          >
            <Tick className="size-5" />
            <span>{isSubmitting ? "Saving..." : "Save All Modules"}</span>
          </button>
        )}
      </div>
    </form>
  );
}
