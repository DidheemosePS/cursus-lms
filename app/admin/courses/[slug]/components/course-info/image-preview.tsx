import Close from "@/assets/icons/close.svg";
import Image from "next/image";

export interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
}

export default function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative space-y-2 max-w-max">
      <Image
        src={src}
        width={240}
        height={135}
        alt="Course cover preview"
        className="w-60 h-auto rounded-lg border-2 border-dashed border-gray-300"
        priority={false}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 p-1 text-red-500 bg-red-50 rounded cursor-pointer"
        aria-label="Remove cover image"
      >
        <Close className="size-4.5" />
      </button>
    </div>
  );
}
