import { Instructor } from "./instructors";
import Search from "@/assets/icons/search.svg";
import InstructorsItem from "./instructors-item";

export interface SearchSectionProps {
  inputValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchUsers: Instructor[];
  isSearching: boolean;
  hasSearchTerm: boolean;
  assignedInstructorIds: Set<string>;
  onAddInstructor: (instructor: Instructor) => void;
}

export default function SearchSection({
  inputValue,
  onSearchChange,
  searchUsers,
  isSearching,
  hasSearchTerm,
  assignedInstructorIds,
  onAddInstructor,
}: SearchSectionProps) {
  return (
    <div className="space-y-3">
      <div className="h-9 flex items-center pl-3 rounded-lg overflow-hidden ring ring-gray-200 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
        <Search className="size-4 text-[#617789] shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={onSearchChange}
          placeholder="Search to add instructor…"
          className="w-full h-full px-2 text-sm placeholder:text-[#617789] outline-0 text-[#111518]"
        />
      </div>

      {isSearching && (
        <p className="text-xs text-gray-400 text-center py-2">Searching…</p>
      )}

      {/* Empty state — only show when user has typed and results came back empty */}
      {!isSearching && hasSearchTerm && searchUsers.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-2">
          No instructors found
        </p>
      )}

      {searchUsers.map((instructor) => (
        <InstructorsItem
          key={instructor.id}
          instructor={instructor}
          action="add"
          isAssigned={assignedInstructorIds.has(instructor.id)}
          onClick={() => onAddInstructor(instructor)}
        />
      ))}
    </div>
  );
}
