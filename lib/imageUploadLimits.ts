export const MAX_IMAGES_PER_POST = 10;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_TOTAL_IMAGE_BYTES = MAX_IMAGE_SIZE_BYTES * MAX_IMAGES_PER_POST;
export const MAX_UPLOAD_REQUEST_BYTES = MAX_TOTAL_IMAGE_BYTES + 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const IMAGE_FILE_ACCEPT = ALLOWED_IMAGE_MIME_TYPES.join(",");
