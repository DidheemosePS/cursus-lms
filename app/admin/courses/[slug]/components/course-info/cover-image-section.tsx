import ErrorMessage from "./error-message";
import ImagePreview from "./image-preview";
import UploadZone from "./upload-zone";

export interface CoverImageSectionProps {
  coverImage: string | File | null;
  onImageDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  onRemove: () => void;
}

export default function CoverImageSection({
  coverImage,
  onImageDrop,
  onImageChange,
  error,
  onRemove,
}: CoverImageSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-semibold text-gray-700">
        Cover Image
      </label>

      {!coverImage ? (
        <UploadZone onDrop={onImageDrop} onChange={onImageChange} />
      ) : (
        <ImagePreview
          src={
            typeof coverImage === "string"
              ? coverImage
              : URL.createObjectURL(coverImage)
          }
          onRemove={onRemove}
        />
      )}

      {error && <ErrorMessage text={error} />}
    </div>
  );
}
