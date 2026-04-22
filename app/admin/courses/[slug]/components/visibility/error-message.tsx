import Warning from "@/assets/icons/warning.svg";

export default function ErrorMessage({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-red-600">
      <Warning className="size-3 shrink-0" />
      <span>{text}</span>
    </p>
  );
}
