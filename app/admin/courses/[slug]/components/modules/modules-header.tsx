import Module from "@/assets/icons/module.svg";

export default function ModulesHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between  mb-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="text-blue-500 bg-[#135BEC]/10 p-2 rounded-lg">
          <Module className="size-5" />
        </div>
        <p className="text-xl font-bold">Modules</p>
      </div>
      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
        {count} Modules
      </span>
    </div>
  );
}
