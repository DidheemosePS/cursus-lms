"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useParams } from "next/navigation";
import Header from "./header";
import SearchSection from "./search-section";
import AssignedSection from "./assigned-section";
import { addInstructorToCourse, removeInstructorFromCourse } from "./actions";

export interface Instructor {
  id: string;
  name: string;
  role: "admin" | "instructor" | "learner";
}

export interface InstructorsProps {
  instructor: Instructor;
  courseId: string;
  instructorId: string;
}

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 1;

export default function Instructors({
  instructors,
}: {
  instructors: Promise<InstructorsProps[]>;
}) {
  // Course Id
  const { slug } = useParams<{ slug: string }>();

  // Db call
  const initialInstructors = use(instructors);

  const [instructorsData, setInstructorsData] = useState(initialInstructors);
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState<Instructor[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  // Get existing instructor IDs
  const assignedInstructorsIds = useMemo(
    () => new Set(instructorsData.map((t) => t.instructorId)),
    [instructorsData],
  );

  // Fetch search results
  useEffect(() => {
    if (debounceSearch.length < MIN_SEARCH_LENGTH) {
      setSearchUsers([]);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    // API call
    const loadUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/courses/${
            slug
          }/search-instructors?q=${encodeURIComponent(debounceSearch)}`,
          {
            credentials: "include",
            signal: controller.signal,
          },
        );

        // API error handling
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        setSearchUsers(
          data.success && Array.isArray(data.users) ? data.users : [],
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Search failed", error);
          setSearchUsers([]);
        }
      } finally {
        setIsSearching(false);
      }
    };

    loadUsers();

    // Abort the call when unmounting
    return () => controller.abort();
  }, [debounceSearch, slug]);

  const handleAddInstructors = useCallback(
    (instructor: Instructor) => {
      // Optimistic update
      setInstructorsData((prev) => [
        {
          courseId: slug,
          instructorId: instructor.id,
          instructor: instructor,
        },
        ...prev,
      ]);
      setSearchUsers((prev) => prev.filter((u) => u.id !== instructor.id));

      // Calling server action
      addInstructorToCourse(slug, instructor.id).catch((error) => {
        // Rollback if there is an error
        setInstructorsData((prev) =>
          prev.filter((t) => t.instructorId !== instructor.id),
        );
        setSearchUsers((prev) =>
          prev.some((u) => u.id === instructor.id)
            ? prev
            : [instructor, ...prev],
        );
        console.error("Failed to add instructor", error);
      });
    },
    [slug],
  );

  const handleRemoveInstructor = useCallback(
    (instructor: Instructor) => {
      // Optimistic update
      setInstructorsData((prev) =>
        prev.filter((t) => t.instructorId !== instructor.id),
      );

      // Add back to search results if search matches
      if (
        debounceSearch &&
        instructor.name.toLowerCase().includes(debounceSearch.toLowerCase())
      ) {
        setSearchUsers((prev) =>
          prev.some((u) => u.id === instructor.id)
            ? prev
            : [instructor, ...prev],
        );
      }

      // Calling server action
      removeInstructorFromCourse(slug, instructor.id).catch((error) => {
        // Rollback if there is an error
        setInstructorsData((prev) => [
          {
            courseId: slug,
            instructorId: instructor.id,
            instructor: instructor,
          },
          ...prev,
        ]);

        setSearchUsers((prev) => prev.filter((u) => u.id !== instructor.id));
        console.error("Failed to remove instructor", error);
      });
    },
    [slug, debounceSearch],
  );

  return (
    <div className="rounded-lg shadow-sm p-6 bg-white">
      <Header />
      <div className="space-y-4">
        <SearchSection
          search={search}
          onSearchChange={(e) => setSearch(e.target.value.trimStart())}
          searchUsers={searchUsers}
          isSearching={isSearching}
          debouncedSearch={debounceSearch}
          assignedInstructorIds={assignedInstructorsIds}
          onAddInstructor={handleAddInstructors}
        />
        <AssignedSection
          instructors={instructorsData}
          onRemoveInstructor={handleRemoveInstructor}
        />
      </div>
    </div>
  );
}
