import { S3Client } from "@aws-sdk/client-s3";

// S3 Credentials
export const S3_CONFIG = {
  REGION: process.env.NEXT_AWS_S3_REGION || "eu-west-1",
  BUCKET: process.env.NEXT_AWS_S3_BUCKET_NAME || "",
  ACCESS_KEY_ID: process.env.NEXT_AWS_S3_ACCESS_KEY_ID || "",
  SECRET_ACCESS_KEY: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY || "",
} as const;

// Upload Config
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5242880, // 5MB in bytes
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  FOLDER: ["coverImage", "submission"],
} as const;

// Error types
export type S3ErrorCode =
  | "INVALID_CONFIG"
  | "INVALID_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "UPLOAD_FAILED"
  | "NETWORK_ERROR";

// S3 Upload Response
export interface S3UploadResponse {
  success: true;
  url: string;
  key: string;
  size: number;
  type: string;
  timestamp: string;
}

// S3 Upload Error
export interface S3UploadError {
  success: false;
  error: string;
  code: S3ErrorCode;
  details?: string;
}

export type S3UploadResult = S3UploadResponse | S3UploadError;

// Create S3 client
export const s3Client = new S3Client({
  region: S3_CONFIG.REGION,
  credentials: {
    accessKeyId: S3_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: S3_CONFIG.SECRET_ACCESS_KEY,
  },
});

export function validateFile(file: File): {
  valid: boolean;
  fileName?: string;
  error?: string;
  code?: S3ErrorCode;
} {
  // Check file exists or not
  if (!file)
    return { valid: false, error: "No file found", code: "INVALID_FILE" };

  // Check file size
  if (file.size === 0)
    return { valid: false, error: "File is empty", code: "INVALID_FILE" };

  //   Check file max size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE)
    return {
      valid: false,
      error: `File size exceed ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };

  // Check file type
  if (
    !UPLOAD_CONFIG.ALLOWED_TYPES.includes(
      file.type as
        | "image/jpeg"
        | "image/png"
        | "image/webp"
        | "application/pdf",
    )
  ) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${UPLOAD_CONFIG.ALLOWED_TYPES.join(", ")}`,
      code: "INVALID_FILE_TYPE",
    };
  }

  //   Check file name
  if (!file.name || file.name.trim().length === 0)
    return {
      valid: false,
      error: "File name is invalid",
      code: "INVALID_FILE",
    };

  const fileName = file.name.replaceAll(" ", "-");

  return { valid: true, fileName };
}
