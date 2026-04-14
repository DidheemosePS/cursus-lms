"use client";

import { use, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "./header";
import SearchSection from "./search-section";
import AssignedSection from "./assigned-section";
import {
  addInstructorToCourse,
  removeInstructorFromCourse,
  searchInstructors,
} from "./actions";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";

export interface Instructor {
  id: string;
  name: string;
  role: "admin" | "instructor" | "learner";
  avatar: string;
}

export interface InstructorsProps {
  instructor: Instructor;
  courseId: string;
  instructorId: string;
}

export default function Instructors({
  instructors,
}: {
  instructors: Promise<InstructorsProps[]>;
}) {
  const { slug } = useParams<{ slug: string }>();
  const initialInstructors = use(instructors);

  const [instructorsData, setInstructorsData] = useState(initialInstructors);

  const [inputValue, setInputValue] = useState("");

  const [searchUsers, setSearchUsers] = useState<Instructor[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized — only recomputes when instructorsData changes
  const assignedInstructorsIds = useMemo(
    () => new Set(instructorsData.map((t) => t.instructorId)),
    [instructorsData],
  );

  const handleSearch = useDebounceCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchUsers([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const results = await searchInstructors(slug, term);
    setSearchUsers(results);
    setIsSearching(false);
  }, 300);

  const handleAddInstructors = (instructor: Instructor) => {
    setInstructorsData((prev) => [
      { courseId: slug, instructorId: instructor.id, instructor },
      ...prev,
    ]);
    setSearchUsers((prev) => prev.filter((u) => u.id !== instructor.id));

    addInstructorToCourse(slug, instructor.id).catch(() => {
      setInstructorsData((prev) =>
        prev.filter((t) => t.instructorId !== instructor.id),
      );
      setSearchUsers((prev) =>
        prev.some((u) => u.id === instructor.id) ? prev : [instructor, ...prev],
      );
    });
  };

  const handleRemoveInstructor = (instructor: Instructor) => {
    setInstructorsData((prev) =>
      prev.filter((t) => t.instructorId !== instructor.id),
    );

    // Uses stable `search` — not `inputValue` which could be cleared
    if (
      inputValue &&
      instructor.name.toLowerCase().includes(inputValue.toLowerCase())
    ) {
      setSearchUsers((prev) =>
        prev.some((u) => u.id === instructor.id) ? prev : [instructor, ...prev],
      );
    }

    removeInstructorFromCourse(slug, instructor.id).catch(() => {
      setInstructorsData((prev) => [
        { courseId: slug, instructorId: instructor.id, instructor },
        ...prev,
      ]);
      setSearchUsers((prev) => prev.filter((u) => u.id !== instructor.id));
    });
  };

  return (
    <div className="rounded-lg shadow-sm p-6 bg-white">
      <Header />
      <div className="space-y-4">
        <SearchSection
          inputValue={inputValue}
          onSearchChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
          searchUsers={searchUsers}
          isSearching={isSearching}
          hasSearchTerm={inputValue.length >= 1}
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
