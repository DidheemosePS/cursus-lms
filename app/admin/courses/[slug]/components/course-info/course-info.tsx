"use client";

import { useCallback, useRef, useState } from "react";
import Header from "./header";
import FormActions from "./form-actions";
import CoverImageSection from "./cover-image-section";
import InputField from "./input-field";
import TextAreaField from "./text-area-field";
import { useParams } from "next/navigation";

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  coverImageUrl: string;
}

type FormState = Omit<Course, "id">;

export type FieldChanges = Partial<Omit<Course, "id">>;

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

const MAX_FILE_SIZE = 5242880; // 5MB in bytes

const FIELD_MAP = {
  course_name: "title",
  course_code: "code",
  description: "description",
};

export default function CourseInfo({ course }: { course: Course }) {
  // Course Id
  const { slug } = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  // OriginalRef to compare db values with updating
  const originalRef = useRef<FormState>({
    title: course.title,
    code: course.code,
    description: course.description,
    coverImageUrl: course.coverImageUrl,
  });

  // Store updating values
  const [formState, setFormState] = useState<FormState>({
    title: course.title,
    code: course.code,
    description: course.description,
    coverImageUrl: course.coverImageUrl,
  });

  // Image state
  const [coverImage, setCoverImage] = useState<string | File | null>(
    formState.coverImageUrl,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return only changed fields
  const getChangedFields = useCallback((current: FormState): FieldChanges => {
    const original = originalRef.current;
    const changes: FieldChanges = {};

    if (current.title !== original.title) changes.title = current.title;
    if (current.code !== original.code) changes.code = current.code;
    if (current.description !== original.description)
      changes.description = current.description;

    return changes;
  }, []);

  // Check for any input changes
  const checkChanges = useCallback(
    (state: FormState): boolean => {
      const hasFieldChanges = Object.keys(getChangedFields(state)).length > 0;
      const hasImageChanges = coverImage instanceof File;
      return hasFieldChanges || hasImageChanges;
    },
    [coverImage, getChangedFields],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const fieldName = FIELD_MAP[name as keyof typeof FIELD_MAP];

      if (!fieldName) return;

      setFormState((prev) => {
        const updated = { ...prev, [fieldName]: value };
        setIsEditing(checkChanges(updated));
        return updated;
      });
    },
    [checkChanges],
  );

  // Image drag and drop
  const handleCoverImageDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (!file) return;

      setError(null);

      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Invalid file type. Please use PNG, JPEG, GIF, or SVG.");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit.");
        return;
      }

      // const previewUrl = URL.createObjectURL(file);
      setCoverImage(file);
      setIsEditing(true);
    },
    [],
  );

  // Image upload change
  const handleCoverImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      setError(null);

      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Invalid file type. Please use PNG, JPEG, GIF, or SVG.");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB limit.");
        return;
      }

      // const previewUrl = URL.createObjectURL(file);
      setCoverImage(file);
      setIsEditing(true);
    },
    [],
  );

  // Course info update function
  const handleSubmit = useCallback(async () => {
    try {
      // Return only changed fields
      const changes = getChangedFields(formState);
      setIsSaving(true);

      const formData = new FormData();

      if (changes.title) formData.append("title", changes.title);
      if (changes.description)
        formData.append("description", changes.description);
      if (changes.code) formData.append("code", changes.code);
      if (coverImage instanceof File) {
        formData.append("coverImageUrl", coverImage);
        formData.append("previousImageUrl", formState.coverImageUrl);
      }

      // Calling API to save changes
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/courses/${slug}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        },
      );

      // API error handling
      if (!response.ok) {
        throw new Error("Failed Request");
      }

      const res: { success: boolean; error?: string; coverImageUrl?: string } =
        await response.json();

      if (!res.success) {
        setError(res.error || "Failed to update course");
        return;
      }

      // Update the original ref with updated values
      originalRef.current = {
        ...formState,
        coverImageUrl: res.coverImageUrl ?? formState.coverImageUrl,
      };

      // State reset
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("An unexpected error occurred. Please try again");
      console.error("Submit error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [coverImage, formState, getChangedFields, slug]);

  const handleReset = useCallback(() => {
    setFormState({ ...originalRef.current });
    setCoverImage(originalRef.current.coverImageUrl);
    setIsEditing(false);
    setError(null);
    formRef.current?.reset();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <Header />
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-6">
        <CoverImageSection
          coverImage={coverImage}
          onImageDrop={handleCoverImageDrop}
          onImageChange={handleCoverImage}
          error={error}
          onRemove={() => setCoverImage(null)}
        />
        <InputField
          label="Course Name"
          name="course_name"
          value={formState.title}
          onChange={handleInputChange}
        />
        <InputField
          label="Course Code"
          name="course_code"
          value={formState.code}
          onChange={handleInputChange}
        />
        <TextAreaField
          label="Description"
          name="description"
          value={formState.description}
          onChange={handleInputChange}
        />

        {isEditing && (
          <FormActions onCancel={handleReset} isSaving={isSaving} />
        )}
      </form>
    </div>
  );
}
