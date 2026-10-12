"use client"


import { useEffect, useRef, useState } from "react";
import { useEditPostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

type Props = {
  postId: string,
  initialContent: string,
  initialImgURLs: string[],
  onClose: () => void;
}




export default function EditPostModal ({postId,initialContent,initialImgURLs,onClose} : Props) {
    
    const [content, setContent] = useState(initialContent);
    const [images, setImages] = useState<{ url: string; file?: File }[]>(
      initialImgURLs.map((url) => ({ url }))
    );
    const previewUrlsRef = useRef(new Set<string>());
    const [error, setError] = useState<string | null>(null);
    const editPostMutation = useEditPostMutation();
    const queryClient = useQueryClient();
    
    const handleEdit = async () => {
        if(!content.trim()) return;

        try {
            const imageUrls = images.filter((image) => !image.file).map((image) => image.url);
            const selectedImages = images.filter((image): image is { url: string; file: File } => !!image.file);

            if(selectedImages.length){
                const formData = new FormData();
                selectedImages.forEach(({ file }) => formData.append("files", file));
                const uploadImg = await fetch("/api/img-upload",
                   { method : "POST",
                    body : formData }
                );
                
                if(!uploadImg.ok){
                    const errorData = await uploadImg.json()
                    throw new Error(errorData.error || "Error uploading image")
                };

                const data = await uploadImg.json()
                imageUrls.push(...data.images.map((image: { imageUrl: string }) => image.imageUrl));
            }
  
            await editPostMutation.mutateAsync({
           payload : { 
            postId,
            content,
            imgURLs: imageUrls
        }
        });

            await queryClient.invalidateQueries({
            queryKey: ["GetAllPosts"]
        });
            await queryClient.invalidateQueries({
            queryKey: ["GetPostById", { postId }]
        });

            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to update post");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const files = Array.from(e.target.files ?? []);
         if (!files.length) return;
         const newImages = files.map((file) => {
           const url = URL.createObjectURL(file);
           previewUrlsRef.current.add(url);
           return { url, file };
         });
         setImages((current) => [...current, ...newImages]);
         e.target.value = "";
    };

    useEffect(() => {
      const previewUrls = previewUrlsRef.current;
      return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    return (
     <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
     >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] rounded-2xl border border-gray-700 bg-black p-6"
      >
        <h2 className="text-xl font-semibold">
          Edit Post
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-5 w-full resize-none rounded-xl border border-gray-700 bg-transparent p-4 outline-none"
          rows={5}
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-5 py-2 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleEdit}
            disabled={editPostMutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {editPostMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="relative">
                <Image
                  height={300}
                  width={400}
                  src={image.url}
                  alt={`Post image ${index + 1}`}
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
                    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-2 text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
          <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-4"
          />
      </div>
     </div>
  );
};