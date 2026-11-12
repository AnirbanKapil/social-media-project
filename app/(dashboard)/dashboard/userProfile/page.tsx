
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
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/context/toast-provider";
import { getFullName } from "@/lib/displayName";


export default function ProfilePage() {

  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
 
  const mutation = useUpdateProfileImageMutation();
  const removeProfileImageMutation = useRemoveProfileImageMutation();

  const { data, isLoading, error } = useGetCurrentUserQuery({},
    {
      staleTime: 0, 
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
    
    const changeProfilePic = async (result : unknown) => {
       setIsUploading(true) 
       try {
        const info = (
          result as { info?: { secure_url?: string; public_id?: string } } | null
        )?.info;
        const imageUrl = info?.secure_url;
        const imageId = info?.public_id;
        if (!imageUrl) {
          throw new Error("Could not read the uploaded image");
        }
        await mutation.mutateAsync({
          profileImgUrl : imageUrl,
          profileImgPublicId : imageId
        })
        await queryClient.invalidateQueries({ queryKey: ["GetCurrentUser"] });
       } catch (error) {
        showToast({
          title: "Could not update profile picture",
          description: error instanceof Error ? error.message : undefined,
        });
       } finally {
         setIsUploading(false);
       }
    };
    
    const removeProfilePic = async () => {
      try {
        await removeProfileImageMutation.mutateAsync({});
        await queryClient.invalidateQueries({ queryKey: ["GetCurrentUser"] });
      } catch (error) {
         showToast({
           title: "Could not remove profile picture",
           description: error instanceof Error ? error.message : undefined,
         });
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
                <h1 className="font-bold">{getFullName(user)}</h1>
                <p className="text-sm text-slate-500">@{user?.username}</p>
                <p className="text-slate-600 mx-1">Posts {user?.posts?.length}</p>
             </div>
          </div>
          <div className="border-b border-slate-800 my-5">
           <div className="flex flex-wrap items-center gap-3"> 
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
           <div className="mx-2 flex flex-wrap items-center gap-x-6 gap-y-1">
            <div className="my-5">
             <h1 className="font-extrabold text-3xl">{getFullName(user)}</h1>
             <p className="text-slate-500">@{user?.username}</p>
            </div>
            <h3 className="my-5 text-slate-600">Followers {user?.followersCount}</h3>
            <h3 className="my-5 text-slate-600">Following {user?.followingCount}</h3> 
           </div>
          </div> 
          <div>
            {user?.posts && user?.posts.map((post) => (
              <Feeds key={post?.id} userImg={user?.profileImgUrl}
              id={post?.id || ""}
              content={post?.content || "No content available"} 
              visibility={post?.visibility}
              user={user?.username || "Unknown User"}
              firstName={user?.firstName ?? undefined}
              lastName={user?.lastName ?? undefined}
              imgSrcs={post?.imgURLs ?? []}
              created={post?.createdAt || "unknown"}
              likesCount={post?.likesCount}
              isLiked={post?.isLiked}
              isBookmarked={post?.isBookmarked}
              isReposted={post?.isReposted}
              repostsCount={post?.repostsCount}
              repostOf={post?.repostOf}
              commentsCount={post?.commentsCount}
              />
            ))}
          </div>
        </div>
      );

}  