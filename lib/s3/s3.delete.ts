import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3_CONFIG } from "./s3.utils";
import { s3Client } from "./s3.utils";

export async function S3Delete(
  url: string,
): Promise<{ success: boolean; error: string }> {
  try {
    const key = new URL(url).pathname.slice(1);

    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.BUCKET,
      Key: key,
    });

    await s3Client.send(command);

    return { success: true, error: "File deleted successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}
