

"use client";

import Image from "next/image";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Feeds } from "@/app/src/components/feeds";
import { Loader } from "@/app/src/components/loader";
import { useGetUserByUsernameQuery } from "@/lib/generated";
import { useFollowUserMutation } from "@/lib/generated";
import { useUnfollowUserMutation } from "@/lib/generated";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export default function UsersPage() {

  const userName = useParams().username as string;  

   const { data, isLoading, error } = useGetUserByUsernameQuery({ username: userName || "" },
        {
        staleTime: 1000 * 60 * 5, 
        refetchOnWindowFocus: false 
        }
   );

    const { mutateAsync: followUser } = useFollowUserMutation();
    const { mutateAsync: unfollowUser } = useUnfollowUserMutation();
   
     const queryClient = useQueryClient();

    if (isLoading) return <Loader />;

    if (error) {
    const err = error as Error;
    return <p>Error: {err.message}</p>;
    }

    if (!data) return <p>No data</p>;

    const user = data?.getUserByUsername;
    
    const isFollowing = user?.isFollowing

    const handleFollow = async () => {
      if(isFollowing){
        await unfollowUser({to : user?.id})
      }else {
        await followUser({to : user?.id})
      }

      queryClient.invalidateQueries({
        queryKey: ["GetUserByUsername"]
      })
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
            <p className="text-slate-600 mx-1">Posts 100</p>
         </div>
      </div>
      <div className="border-b border-slate-800 my-5">
      {user?.profileImgUrl ? (
          <Image
           alt="profileImg"
           src={user.profileImgUrl}
           width={100}
           height={100}
      />
      ) : <div className="w-18 h-18 rounded-full bg-blue-300 m-3"></div>}
        <div className="flex justify-between">
        <h1 className="font-extrabold text-3xl mx-5 my-5">{user?.username}</h1> 
        <button onClick={handleFollow}
        className="self-center block-inline mt-2 p-2 mx-3 cursor-pointer 
         hover:bg-blue-400 hover:scale-120 transition-transform duration-300 bg-blue-600 rounded-lg">
           {isFollowing ? "Unfollow" : "Follow"}
        </button>
        </div> 
      </div> 
      <div>
        {user?.posts && user?.posts.map((post) => (
          <Feeds key={post?.id} userImg={user?.profileImgUrl}
          content={post?.content || "No content available"} 
          user={user?.username || "Unknown User"}
          imgSrc={post?.imgURL}
          />
        ))}
      </div>
    </div>
  );
}