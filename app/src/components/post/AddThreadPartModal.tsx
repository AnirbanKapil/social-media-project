"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useAppendThreadPartMutation } from "@/lib/generated";
import {
  createThreadPartSchema,
  POST_CONTENT_OR_IMAGE_MESSAGE,
} from "@/lib/validation";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  IMAGE_FILE_ACCEPT,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGES_PER_POST,
  MAX_TOTAL_IMAGE_BYTES,
} from "@/lib/imageUploadLimits";

type Props = {
  rootId: string;
  onClose: () => void;
};

export default function AddThreadPartModal({ rootId, onClose }: Props) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<{ url: string; file?: File }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const previewUrlsRef = useRef(new Set<string>());
  const appendThreadPart = useAppendThreadPartMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (images.length + files.length > MAX_IMAGES_PER_POST) {
      setError(`A post can contain at most ${MAX_IMAGES_PER_POST} images.`);
      e.target.value = "";
      return;
    }
    if (
      files.some((file) =>
        !ALLOWED_IMAGE_MIME_TYPES.includes(
          file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
        ),
      )
    ) {
      setError("Only JPEG, PNG, WebP, and GIF images are supported.");
      e.target.value = "";
      return;
    }
    if (files.some((file) => file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES)) {
      setError("Each image must be non-empty and no larger than 10 MB.");
      e.target.value = "";
      return;
    }
    const newTotal =
      images.reduce((total, image) => total + (image.file?.size ?? 0), 0) +
      files.reduce((total, file) => total + file.size, 0);
    if (newTotal > MAX_TOTAL_IMAGE_BYTES) {
      setError("The total size of newly selected images cannot exceed 100 MB.");
      e.target.value = "";
      return;
    }

    setError(null);
    const newImages = files.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.add(url);
      return { url, file };
    });
    setImages((current) => [...current, ...newImages]);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    setError(null);

    if (!content.trim() && images.length === 0) {
      setError(POST_CONTENT_OR_IMAGE_MESSAGE);
      return;
    }

    try {
      const imageUrls = images
        .filter((image) => !image.file)
        .map((image) => image.url);
      const selectedImages = images.filter(
        (image): image is { url: string; file: File } => !!image.file,
      );

      if (selectedImages.length) {
        const formData = new FormData();
        selectedImages.forEach(({ file }) => formData.append("files", file));
        const uploadResponse = await fetch("/api/img-upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Error uploading image");
        }

        const uploaded = await uploadResponse.json();
        imageUrls.push(
          ...uploaded.images.map(
            (image: { imageUrl: string }) => image.imageUrl,
          ),
        );
      }

      const parsed = createThreadPartSchema.safeParse({
        content,
        imgURLs: imageUrls,
      });

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Invalid thread part");
        return;
      }

      await appendThreadPart.mutateAsync({
        postId: rootId,
        payload: {
          content: parsed.data.content,
          imgURLs: parsed.data.imgURLs,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["GetPostById"] });
      await queryClient.invalidateQueries({ queryKey: ["GetAllPosts"] });
      await queryClient.invalidateQueries({ queryKey: ["GetCurrentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["GetUserByUsername"] });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add thread part");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-4 max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-2xl border border-gray-700 bg-black p-6"
      >
        <h2 className="text-xl font-semibold">Add to thread</h2>

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          placeholder="Continue the thread..."
          className="mt-5 w-full resize-none rounded-xl border border-gray-700 bg-transparent p-4 outline-none"
          rows={5}
        />

        <input
          type="file"
          accept={IMAGE_FILE_ACCEPT}
          multiple
          onChange={handleImageChange}
          className="mt-4"
        />

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="relative">
                <Image
                  height={300}
                  width={400}
                  src={image.url}
                  alt={`Thread part image ${index + 1}`}
                  className="h-40 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => {
                    if (image.file) {
                      URL.revokeObjectURL(image.url);
                      previewUrlsRef.current.delete(image.url);
                    }
                    setImages((current) =>
                      current.filter((_, imageIndex) => imageIndex !== index),
                    );
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-5 py-2 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={appendThreadPart.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {appendThreadPart.isPending ? "Adding..." : "Add part"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
