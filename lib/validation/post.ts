import { z } from "zod";
import { idSchema, paginationSchema } from "./common";

export const MAX_POST_LENGTH = 500;
export const MAX_POST_IMAGES = 10;

export const POST_VISIBILITIES = ["PUBLIC", "FOLLOWERS", "PRIVATE"] as const;

export const postVisibilitySchema = z.enum(POST_VISIBILITIES);

const imageUrlSchema = z
  .string()
  .trim()
  .url("Image URLs must be valid URLs")
  .max(2048);

const imageUrlsSchema = z
  .array(imageUrlSchema)
  .max(MAX_POST_IMAGES, `You can attach at most ${MAX_POST_IMAGES} images`);

const optionalImageUrlSchema = imageUrlSchema.optional();

export const postContentSchema = z
  .string()
  .trim()
  .max(MAX_POST_LENGTH, `Post must be at most ${MAX_POST_LENGTH} characters`);

export const postContentFormSchema = z.object({
  content: postContentSchema,
});

export const POST_CONTENT_OR_IMAGE_MESSAGE =
  "Post must contain text or at least one image";

function requireContentOrImage(data: {
  content?: string;
  imgURL?: string | null;
  imgURLs?: string[];
}) {
  return (
    (data.content?.trim().length ?? 0) > 0 ||
    !!data.imgURL ||
    (data.imgURLs?.length ?? 0) > 0
  );
}

export const postIdArgsSchema = z.object({ postId: idSchema });

export const createPostSchema = z
  .object({
    content: postContentSchema.optional().default(""),
    imgURL: optionalImageUrlSchema,
    imgURLs: imageUrlsSchema.optional(),
    visibility: postVisibilitySchema.optional().default("PUBLIC"),
  })
  .refine(requireContentOrImage, {
    message: POST_CONTENT_OR_IMAGE_MESSAGE,
    path: ["content"],
  });

export const editPostSchema = z
  .object({
    postId: idSchema,
    content: postContentSchema.optional(),
    imgURL: optionalImageUrlSchema.nullish(),
    imgURLs: imageUrlsSchema.optional(),
    visibility: postVisibilitySchema.optional(),
  })
  .refine(requireContentOrImage, {
    message: POST_CONTENT_OR_IMAGE_MESSAGE,
    path: ["content"],
  });

export const postPaginationSchema = paginationSchema;
