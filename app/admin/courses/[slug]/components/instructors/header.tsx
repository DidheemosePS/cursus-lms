import Group from "@/assets/icons/group.svg";

export default function Header() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
        <Group className="size-5" />
      </span>
      <p className="text-lg font-bold">Instructors</p>
    </div>
  );
}
