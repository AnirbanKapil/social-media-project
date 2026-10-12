"use client"

import Image from "next/image";
import { MdOutlinePermMedia } from "react-icons/md";
import { useCreatePostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useGetCurrentUserQuery } from "@/lib/generated";

export function Publish () {

    const [selectedFiles,setSelectedFiles] = useState<File[]>([])
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const previewUrlsRef = useRef(new Set<string>());
    const { data } = useGetCurrentUserQuery({});
    const user = data?.currUser

    const handleSelectImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        newPreviewUrls.forEach((url) => previewUrlsRef.current.add(url));
        setSelectedFiles((current) => [...current, ...files]);
        setPreviewUrls((current) => [...current, ...newPreviewUrls]);
        e.target.value = "";
    };

    const removeSelectedImage = (index: number) => {
        const removedPreview = previewUrls[index];
        if (removedPreview) {
            URL.revokeObjectURL(removedPreview);
            previewUrlsRef.current.delete(removedPreview);
        }
        setSelectedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
        setPreviewUrls((current) => current.filter((_, previewIndex) => previewIndex !== index));
    };

    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const {mutateAsync, isPending} = useCreatePostMutation();

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            selectedFiles.forEach((file) => formData.append("files", file));
            const imageUrls: string[] = [];

            if (selectedFiles.length) {
                const uploadImg = await fetch("/api/img-upload", {
                    method: "POST",
                    body: formData
                });

                if (!uploadImg.ok) {
                    const errorData = await uploadImg.json();
                    throw new Error(errorData.error || "Error uploading images");
                }

                const data = await uploadImg.json();
                imageUrls.push(...data.images.map((image: { imageUrl: string }) => image.imageUrl));
            }

            await mutateAsync({payload : {content , imgURLs: imageUrls}});
            await queryClient.invalidateQueries({queryKey : ["GetAllPosts"]});
            setContent("");
            setSelectedFiles([]);
            setPreviewUrls([]);
            previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            previewUrlsRef.current.clear();
            alert("Post created!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Error creating post: ${message}`);
        }
    }

    useEffect(() => {
        const previewUrls = previewUrlsRef.current;
        return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    return (
        <div className="grid grid-cols-12 border-b border-gray-600 m-2">
            <div className="col-span-1">
             {user?.profileImgUrl && <Image alt="DP image" src={user.profileImgUrl} height={50} width={50}
              className="rounded-full m-1 w-12 h-12" />}
            </div>
            <div className="col-span-11">
                <form onSubmit={handleSubmit}>
                <textarea 
                value={content}
                onChange={(e)=> setContent(e.target.value)}
                className="w-full border-b border-slate-700 p-3 text-xl m-1" 
                rows={3} 
                placeholder="What's on your mind???">
                </textarea>
                {previewUrls.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {previewUrls.map((previewUrl, index) => (
                            <div key={previewUrl} className="relative">
                                <Image
                                    src={previewUrl}
                                    width={600}
                                    height={400}
                                    alt={`Selected image ${index + 1}`}
                                    className="h-40 w-full rounded-md object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSelectedImage(index)}
                                    aria-label={`Remove image ${index + 1}`}
                                    className="absolute right-2 top-2 rounded-full bg-red-600 px-2 text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-between m-2">
                <label className="cursor-pointer" aria-label="Add images">
                    <MdOutlinePermMedia className="text-xl items-center"/>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSelectImg}
                        className="sr-only"
                    />
                </label>
                <button 
                 type="submit" disabled={isPending} 
                className="bg-blue-600 rounded-lg px-3 cursor-pointer disabled:opacity-50">
                    {isPending ? "Posting..." : "Post"}
                </button>
                </div>
                </form>
            </div>
        </div>
    )
}
