"use client"

import Image from "next/image";
import { MdOutlinePermMedia } from "react-icons/md";
import { useCreatePostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const CreatePostForm = () => {
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
            alert(`Error creating post: ${error.message}`);
        }
    });

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        mutate({payload : {content}});
}
}




export function Publish () {

    const handleSelectImg = () => {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accept","image/*")
        input.click();
    }

    return (
        <div className="grid grid-cols-12 border-b border-gray-600 m-2">
            <div className="col-span-1">
             <Image alt="DP image" src="https://avatars.githubusercontent.com/u/131807985?v=4" height={50} width={50} 
              className="rounded-full p-1 pt-2"/>
            </div>
            <div className="col-span-11">
                <textarea 
                className="w-full border-b border-slate-700 p-3 text-xl m-1" 
                rows={3} 
                placeholder="What's on your mind???"></textarea>
                <div className="flex justify-between m-2">
                <MdOutlinePermMedia className="text-xl items-center cursor-pointer" onClick={handleSelectImg}/>
                <button className="bg-blue-600 rounded-lg px-3 cursor-pointer">Post</button>
                </div>
            </div>
        </div>
    )
}
