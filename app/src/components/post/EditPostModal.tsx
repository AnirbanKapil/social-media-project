"use client"


import { useState } from "react";
import { useEditPostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

type Props = {
  postId: string,
  initialContent: string,
  initialImgURL?: string | undefined | null,
  onClose: () => void;
}




export default function EditPostModal ({postId,initialContent,initialImgURL,onClose} : Props) {
    
    const [content, setContent] = useState(initialContent);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialImgURL ?? null);
    const editPostMutation = useEditPostMutation();
    const queryClient = useQueryClient();
    
    const handleEdit = async () => {
        if(!content.trim()) return;
  
        await editPostMutation.mutateAsync({
           payload : { 
            postId,
            content,
            imgURL : initialImgURL
        }
        });

        queryClient.invalidateQueries({
            queryKey: ["GetAllPosts"]
        });

        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (!file) return;
         setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
    };

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
      </div>
          {preview && (
            <Image
            src={preview}
            alt="Post image"
            className="mt-4 max-h-64 w-full rounded-xl object-cover"
            />
          )}
          <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-4"
          />
     </div>
  );
};