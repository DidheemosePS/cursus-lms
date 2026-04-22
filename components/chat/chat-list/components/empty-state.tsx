export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center px-6">
      <p className="text-sm text-[#616f89]">No conversations yet.</p>
      <p className="text-xs text-[#9ca3af] mt-1">
        Your messages will appear here.
      </p>
    </div>
  );
}
