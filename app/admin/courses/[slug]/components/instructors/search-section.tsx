import { Instructor } from "./instructors";
import Search from "@/assets/icons/search.svg";
import InstructorsItem from "./instructors-item";

export interface SearchSectionProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchUsers: Instructor[];
  isSearching: boolean;
  debouncedSearch: string;
  assignedInstructorIds: Set<string>;
  onAddInstructor: (instructor: Instructor) => void;
}

export default function SearchSection({
  search,
  onSearchChange,
  searchUsers,
  isSearching,
  debouncedSearch,
  assignedInstructorIds,
  onAddInstructor,
}: SearchSectionProps) {
  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="h-8 flex items-center pl-2 rounded-lg overflow-hidden outline-0 ring ring-gray-200 focus-within:ring-1 focus-within:ring-blue-500">
        <Search className="size-5 text-[#617789]" />
        <input
          type="text"
          value={search}
          onChange={onSearchChange}
          placeholder="Search to add instructor..."
          className="w-full h-full px-2 text-sm placeholder:text-[#617789] outline-0 focus:ring-0 text-[#111518]"
        />
      </div>

      {isSearching && (
        <p className="text-xs text-gray-400 text-center p-2">Searching</p>
      )}

      {!searchUsers?.length && debouncedSearch && !isSearching && (
        <p className="text-xs text-gray-400 text-center p-2">No instructors</p>
      )}

      {searchUsers?.map((instructor) => {
        return (
          <InstructorsItem
            key={instructor.id}
            instructor={instructor}
            action="add"
            isAssigned={assignedInstructorIds.has(instructor.id)}
            onClick={() => onAddInstructor(instructor)}
          />
        );
      })}
    </div>
  );
}
