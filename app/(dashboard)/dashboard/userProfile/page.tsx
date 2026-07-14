
"use client";

import Image from "next/image";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Feeds } from "@/app/src/components/feeds";
import { Loader } from "@/app/src/components/loader";
import { useGetCurrentUserQuery, useRemoveProfileImageMutation } from "@/lib/generated";
import Link from "next/link";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useUpdateProfileImageMutation } from "@/lib/generated";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";


export default function ProfilePage() {

  const [isUploading, setIsUploading] = useState(false);
 
  const mutation = useUpdateProfileImageMutation();
  const removeProfileImageMutation = useRemoveProfileImageMutation();

  const { data, isLoading, error } = useGetCurrentUserQuery({},
    {
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: false 
    }
  );
  
   if (isLoading) return <Loader />;

    if (error) {
    const err = error as Error;
    return <p>Error: {err.message}</p>;
    }

    if (!data) return <p>No data</p>;

    const user = data?.currUser;
    
    const changeProfilePic = async (result : any) => {
       setIsUploading(true) 
       try {
        const imageUrl = result?.info?.secure_url;
        const imageId  = result?.info?.public_id
        await mutation.mutateAsync({
          profileImgUrl : imageUrl,
          profileImgPublicId : imageId
        })
       } catch (error) {
        console.log(error)
       } finally {
         setIsUploading(false);
       }
    };
    
    const removeProfilePic = async () => {
      try {
        await removeProfileImageMutation.mutateAsync({});
      } catch (error) {
         console.error(error);
      }
    }
    
    return (
        <div className="text-white">
          <div className="flex justify-start items-center gap-4 mx-2">
             <Link href="/dashboard"
              className="cursor-pointer hover:scale-110 transition-transform duration-300 p-2 inline-block">
               <IoMdArrowRoundBack size={24} />
             </Link>
             <div>
                <h1 className="font-bold">{user?.username}</h1> 
                <p className="text-slate-600 mx-1">Posts {user?.posts?.length}</p>
             </div>
          </div>
          <div className="border-b border-slate-800 my-5">
           <div className="flex"> 
            {user?.profileImgUrl ? (
             <Zoom>
              <div className="relative m-3">
                <Image
                 className="m-3 rounded-full"
                 alt="profileImg"
                 src={user.profileImgUrl}
                 width={100}
                 height={100}
                />
                {isUploading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 </div>
                )}
               </div>
             </Zoom>
            ) : <div className="w-18 h-18 rounded-full bg-blue-300 m-3"></div>}
              <CldUploadWidget
               uploadPreset="profile-images"
               options={{
                     cropping: true,
                     croppingAspectRatio: 1,
                     sources: ["local"],
                     }}
               onSuccess={changeProfilePic}
              >
              {({ open }) => (
              <button
               onClick={() => open()}
               disabled={isUploading} 
               className="self-center bg-slate-200 text-black p-1 mx-3 rounded-lg hover:scale-110"
              >
              {isUploading ? "Updating profile Pic" : "Change Profile Pic"}
              </button>
              )}
              </CldUploadWidget>
              {user?.profileImgUrl && <button className="self-center bg-slate-200 text-black p-1 mx-3 rounded-lg hover:scale-110"
                                       onClick={removeProfilePic} 
                                       disabled={removeProfileImageMutation.isPending}>
                                       {removeProfileImageMutation.isPending
                                         ? "Removing..."
                                         : "Remove Profile Pic"}
                                      </button>}
           </div>  
           <div className="flex">
            <h1 className="font-extrabold text-3xl mx-2 my-5">{user?.username}</h1>
            <h3 className="mx-4 my-7 text-slate-600">Followers {user?.followersCount}</h3>
            <h3 className="mx-4 my-7 text-slate-600">Following {user?.followingCount}</h3> 
           </div>
          </div> 
          <div>
            {user?.posts && user?.posts.map((post) => (
              <Feeds key={post?.id} userImg={user?.profileImgUrl}
               id={post?.id || ""}
              content={post?.content || "No content available"} 
              user={user?.username || "Unknown User"}
              imgSrc={post?.imgURL}
              created={post?.createdAt || "unknown"}
              likesCount={post?.likesCount}
              isLiked={post?.isLiked}
              />
            ))}
          </div>
        </div>
      );

}  