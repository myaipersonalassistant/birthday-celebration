/**
 * Upload a file to Supabase Storage with upload progress (XHR).
 * The JS client `.upload()` does not expose progress events.
 */
export function uploadToSupabaseStorage(options: {
  supabaseUrl: string;
  anonKey: string;
  accessToken: string;
  bucket: string;
  path: string;
  file: File;
  upsert?: boolean;
  cacheControl?: string;
  onProgress?: (percent: number) => void;
}): Promise<void> {
  const {
    supabaseUrl,
    anonKey,
    accessToken,
    bucket,
    path,
    file,
    upsert = true,
    cacheControl = "3600",
    onProgress,
  } = options;

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${path}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.responseType = "json";
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("x-upsert", upsert ? "true" : "false");
    xhr.setRequestHeader("cache-control", cacheControl);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const percent = Math.min(
        100,
        Math.round((event.loaded / event.total) * 100),
      );
      onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }

      const body = xhr.response as { message?: string; error?: string } | null;
      const message =
        body?.message ||
        body?.error ||
        xhr.statusText ||
        `Upload failed (${xhr.status})`;

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("bucket")
      ) {
        reject(
          new Error(
            "Invitation storage bucket is missing. Run supabase/invitation-schema.sql.",
          ),
        );
        return;
      }

      reject(new Error(message));
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading. Please try again."));
    };

    xhr.onabort = () => {
      reject(new Error("Upload was cancelled."));
    };

    xhr.send(file);
  });
}
