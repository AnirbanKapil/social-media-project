"use client"

import Image from "next/image";
import { MdOutlinePermMedia } from "react-icons/md";
import { useCreatePostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { CldImage } from 'next-cloudinary'





export function Publish () {

    const [selectedFile,setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   


    const { data } = useGetCurrentUserQuery({});
    const user = data?.currUser

    const handleSelectImg = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if(!target.files?.length) return;
            const file = target.files[0]
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
        input.click();
    };

    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const {mutate , isPending} = useCreatePostMutation({
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ["GetAllPosts"]});
            setContent("");
            setSelectedFile(null);
            setPreviewUrl(null); 
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

    useEffect(() => {
    return () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };
    }, [previewUrl]);

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
                placeholder="What's on your mind???">
                </textarea>
                {previewUrl && (
               <div style={{ position: 'relative', marginTop: '10px', }}>
                 <CldImage
                        width="1200"
                        height="675"
                        src={previewUrl}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio="16:9"
                        gravity='auto'
                        />
                        <button 
                        type="button"
                        onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                }}
                 style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>
                ✕
              </button>
              </div>
          )}
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
