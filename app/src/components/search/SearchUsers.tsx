"use client";


import { useState } from "react";
import { useSearchUsersQuery } from "@/lib/generated";






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
        <div className="w-full rounded-2xl border border-gray-700 p-4 text-slate-600">
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
                <div key={user.id}>
                   {user.username}    
                </div>
             ))}
           </div>
        </div>
    );
};
