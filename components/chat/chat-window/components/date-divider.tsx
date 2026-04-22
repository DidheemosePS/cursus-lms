export function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex justify-center my-4">
      <span className="text-xs font-medium text-[#616f89] bg-[#f0f2f4] px-3 py-1 rounded-full">
        {label}
      </span>
    </div>
  );
}
