import { CourseStatus } from "./visibility";

export default function GetStatusIndicatorColor(status: CourseStatus): string {
  const colors: Record<CourseStatus, string> = {
    active: "#16a34a",
    draft: "#eab308",
    archived: "#eab308",
  };
  return colors[status];
}
