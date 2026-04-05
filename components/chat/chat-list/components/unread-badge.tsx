export function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
      {count}
    </span>
  );
}
