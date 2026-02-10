import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_CONFIG, s3Client, S3ErrorCode, S3UploadResult, UPLOAD_CONFIG } from "./s3.utils";

function validateFile(file: File): {
  valid: boolean;
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
      file.type as "image/jpeg" | "image/png" | "image/webp",
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

  return { valid: true };
}

export default async function S3Upload(file: File): Promise<S3UploadResult> {
  try {
    // validate File
    const fileValidation = validateFile(file);
    if (!fileValidation.valid)
      return {
        success: false,
        error: fileValidation.error || "Invalid file",
        code: fileValidation.code || "INVALID_FILE",
      };

    //   Create S3 key
    const key = `coverImage/${Date.now()}-${file.name}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create upload parameters
    const params = {
      Bucket: S3_CONFIG.BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://lms-mvp-test.s3.eu-west-1.amazonaws.com/${key}`;

    return {
      success: true,
      url,
      key,
      size: file.size,
      type: file.type,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message || "Unknown error";
      const isNetworkError = errorMessage.toLowerCase().includes("network");

      return {
        success: false,
        error: isNetworkError
          ? "Network error - please check you internet"
          : "Failed to upload file to S3",
        code: isNetworkError ? "NETWORK_ERROR" : "UPLOAD_FAILED",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred during upload",
      code: "UPLOAD_FAILED",
    };
  }
}
