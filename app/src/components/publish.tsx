"use client"

import Image from "next/image";
import { MdOutlinePermMedia } from "react-icons/md";
import { useCreatePostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useGetCurrentUserQuery } from "@/lib/generated";


export function Publish () {

    const [selectedFile,setSelectedFile] = useState<File | null>(null)

    const { data } = useGetCurrentUserQuery({});
    const user = data?.currUser

    const handleSelectImg = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if(!target.files?.length) return;
            setSelectedFile(target.files[0]);
        }
        input.click();
    };

    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const {mutate , isPending} = useCreatePostMutation({
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["GetAllPosts"]});
            setContent("");
            alert("Post created!");
        },
        onError : (err) => {
            const error = err as Error;
            console.log(error.message)
            alert(`Error creating post: ${error.message}`);
        }
    });

    const handleSubmit =async (e : React.FormEvent) => {
        e.preventDefault();

        try {
            let imgUrl = "" 

            if(selectedFile){
                const formData = new FormData();
                formData.append("file",selectedFile)
                
                const uploadImg = await fetch("/api/img-upload",
                   { method : "POST",
                    body : formData }
                );
                
                if(!uploadImg.ok){
                    const errorData = await uploadImg.json()
                    throw new Error(errorData.error || "Error uploading image")
                };

                const data = await uploadImg.json()
                imgUrl = data.imageUrl
            }
            
             await mutate({payload : {content , imgURL : imgUrl}});
        } catch (error) {
            throw error
        } finally{
            setSelectedFile(null);
        }
    }
    return (
        <div className="grid grid-cols-12 border-b border-gray-600 m-2">
            <div className="col-span-1">
             {user?.profileImgUrl && <Image alt="DP image" src={user?.profileImgUrl} height={50} width={50}
              className="rounded-full m-1 w-12 h-12" />}
            </div>
            <div className="col-span-11">
                <form onSubmit={handleSubmit}>
                <textarea 
                value={content}
                onChange={(e)=> setContent(e.target.value)}
                className="w-full border-b border-slate-700 p-3 text-xl m-1" 
                rows={3} 
                placeholder="What's on your mind???"></textarea>
                <div className="flex justify-between m-2">
                <MdOutlinePermMedia className="text-xl items-center cursor-pointer" onClick={handleSelectImg}/>
                <button 
                 type="submit" disabled={isPending} 
                className="bg-blue-600 rounded-lg px-3 cursor-pointer">
                    {isPending ? "Posting..." : "Post"}
                </button>
                </div>
                </form>
            </div>
            
        </div>
    )
}
