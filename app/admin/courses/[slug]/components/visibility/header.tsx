import Eye from "@/assets/icons/eye.svg";

export default function Header() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
        <Eye className="size-5" />
      </span>
      <p className="text-lg font-bold">Visibility</p>
    </div>
  );
}
