"use client";


import { useState } from "react";
import { useSearchUsersQuery } from "@/lib/generated";
import Link from "next/link";
import Image from "next/image";




export default function SearchUsers () {
    
    const [keyword, setKeyword] = useState("");

    const {data, isLoading} = useSearchUsersQuery(
        {
            keyword,
        },
        {
            enabled: keyword.trim().length > 0,
        }
    );
    
    return (
        <div className="w-full rounded-2xl border border-gray-700 p-4 text-slate-200">
           <input 
            type="text"
            value={keyword}
            placeholder="Search users by username"
            onChange={(e)=> setKeyword(e.target.value)}
             className="w-full rounded-full border border-gray-700 bg-transparent px-4 py-2 outline-none"
           />

           {isLoading && (
           <p className="mt-4 text-sm text-gray-400">
           Searching...
           </p>
           )}

           <div className="mt-4 space-y-3">
             {data?.searchUsers.map((user)=> (
                <Link
                  key={user.id}
                  href={`/dashboard/${user.username}`}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-800 transition-colors"
                >
                {user.profileImgUrl ? (
                <Image
                src={user.profileImgUrl}
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full"
                />
                ) : (
                <div className="h-10 w-10 rounded-full bg-blue-300" />
                )}
               <div>
               <p className="font-semibold">{user.username}</p>
               </div>
               </Link>
             ))}
           </div>
        </div>
    );
};
