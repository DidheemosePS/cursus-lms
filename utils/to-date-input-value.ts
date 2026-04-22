export default function toDateInputValue(
  value: string | Date | null | undefined,
) {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}
