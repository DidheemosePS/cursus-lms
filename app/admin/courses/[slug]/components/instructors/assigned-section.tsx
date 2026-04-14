import { Instructor, InstructorsProps } from "./instructors";
import InstructorsItem from "./instructors-item";

export default function AssignedSection({
  instructors,
  onRemoveInstructor,
}: {
  instructors: InstructorsProps[];
  onRemoveInstructor: (instructor: Instructor) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        Assigned ({instructors.length})
      </p>

      {instructors.length === 0 ? (
        <p className="text-xs text-[#617789] text-center py-4">
          No instructors assigned yet.
        </p>
      ) : (
        instructors.map((instructor) => (
          <InstructorsItem
            key={instructor.instructor.id}
            instructor={instructor.instructor}
            action="remove"
            onClick={() => onRemoveInstructor(instructor.instructor)}
          />
        ))
      )}
    </div>
  );
}
