import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3UploadResult, validateFile, S3_CONFIG, s3Client } from "./s3.utils";

export default async function S3Upload(
  file: File,
  folder: "coverImage" | "submission",
): Promise<S3UploadResult> {
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
    const key = `${folder}/${Date.now()}-${fileValidation.fileName}`;

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
