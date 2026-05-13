"use client";

import React from "react";
import { useState } from "react";
import { Feeds } from "@/app/src/components/feeds";
import { NavBar } from "@/app/src/components/navbar";
import { WhatsHappening } from "@/app/src/components/whatsHappening";
import { Publish } from "@/app/src/components/publish";
import { useGetAllPostsQuery } from "@/lib/generated";
import { sideBarMenuItems } from "@/lib/sideBarMenu";





export default function Dashboard () {
     const { data, isLoading, error } = useGetAllPostsQuery({});
     
     if (isLoading) return <p>Loading...</p>;
    
     if (error) {
      const err = error as Error;
      return <p>Error: {err.message}</p>;
     } 
     
     const posts = data?.getAllPosts;

      if (!posts) return <p>No data</p>;

     return (
     <div>
        <NavBar />
        <div className="grid grid-cols-12 w-screen h-screen px-52 overflow-hidden">
            <div className="col-span-3 mt-10 sticky top-0 h-screen">
               <ul> 
               {sideBarMenuItems.map((itm)=> <li className="flex justify-center cursor-pointer 
                                                hover:bg-blue-400 hover:scale-120 transition-transform duration-300 w-fit rounded-lg" 
                                                            key={itm.title}>
                                                   <div className="m-6 text-2xl">{itm.title}</div>
                                                   <div className="m-7 text-2xl">{itm.icon}</div>    
                                             </li>)}
               </ul>
            </div>
            <div className="col-span-6 border-r border-l border-gray-600 overflow-y-auto no-scrollbar">
                <div className="mt-16 mb-10">
                    <Publish />
                     {posts.map((post) => (
                        <Feeds key={post?.id} userImg={post?.author?.profileImgUrl} 
                        content={post?.content || "No content available"} 
                        user={post?.author?.username || "Unknown User"}
                        />
                     ))}
                </div>
            </div>
            <div className="col-span-3 mt-10 sticky top-0 h-screen">
                <WhatsHappening />
            </div>
        </div>
     </div>    
    )
}
