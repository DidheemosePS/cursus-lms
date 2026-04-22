import File from "@/assets/icons/file.svg";

export default function Header() {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
        <File className="size-5" />
      </div>
      <p className="text-xl font-bold">Course Information</p>
    </div>
  );
}
