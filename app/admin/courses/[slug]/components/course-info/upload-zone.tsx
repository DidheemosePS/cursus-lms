import File from "@/assets/icons/file.svg";

export interface UploadZoneProps {
  onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadZone({ onDrop, onChange }: UploadZoneProps) {
  return (
    <label
      htmlFor="file-upload"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="group relative w-full h-48 flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <File className="size-9 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
      <p className="text-sm text-gray-500 font-medium">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-400 mt-1">
        SVG, PNG, JPG or GIF (max. 5MB)
      </p>
      <input
        id="file-upload"
        type="file"
        accept="image/svg+xml,image/png,image/jpeg,image/gif"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
