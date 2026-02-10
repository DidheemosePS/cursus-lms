import { Instructor, InstructorsProps } from "./instructors";
import InstructorsItem from "./instructors-item";

export interface AssignedSectionProps {
  instructors: InstructorsProps[];
  onRemoveInstructor: (instructor: Instructor) => void;
}

export default function AssignedSection({
  instructors,
  onRemoveInstructor,
}: AssignedSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        Assigned {instructors.length}
      </p>
      {instructors?.map((instructor) => {
        return (
          <InstructorsItem
            key={instructor.instructor.id}
            instructor={instructor.instructor}
            action="remove"
            onClick={() => onRemoveInstructor(instructor.instructor)}
          />
        );
      })}
    </div>
  );
}
