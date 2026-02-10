"use client";

import Header from "./header";
import StatusInfo from "./status-info";
import StatusToggle from "./status-toggle";
import { useCallback, useState } from "react";
import { updateCourseStatus } from "./actions";
import { useParams } from "next/navigation";
import ErrorMessage from "./error-message";

export type CourseStatus = "active" | "draft" | "archived";

export const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; color: string; bgColor: string }
> = {
  active: {
    label: "Active",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  draft: {
    label: "Draft",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  archived: {
    label: "Archived",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export default function Visibility({
  initialStatus,
  updatedAt,
}: {
  initialStatus: "draft" | "active" | "archived";
  updatedAt: Date;
}) {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<CourseStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleToggleStatus = useCallback(async () => {
    if (isLoading) return;

    const newStatus: CourseStatus = status === "active" ? "archived" : "active";
    const previousStatus = status;

    try {
      setIsLoading(true);
      setError(null);
      setStatus(newStatus);

      const res = await updateCourseStatus(slug, newStatus);

      if (!res.success) {
        setStatus(previousStatus);
        setError(res.error || "Failed to update status");
        return;
      }
    } catch (error) {
      setStatus(previousStatus);
      setError("An unexpected error occurred");
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, status, slug]);

  const config = STATUS_CONFIG[status];
  const isActive = status === "active";

  return (
    <div className="rounded-lg shadow-sm p-6 bg-white">
      <Header />
      <StatusToggle
        isActive={isActive}
        isLoading={isLoading}
        onToggle={handleToggleStatus}
      />
      <StatusInfo status={status} config={config} updatedAt={updatedAt} />
      {error && <ErrorMessage text={error} />}
    </div>
  );
}
