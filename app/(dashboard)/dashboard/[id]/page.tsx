

"use client";

import { useGetCurrentUserQuery } from "@/lib/generated";
import Image from "next/image";
import { Loader } from "@/app/src/components/loader";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function UsersPage() {
  const { data, isLoading, error } = useGetCurrentUserQuery({});
  
  if (isLoading) return <Loader />;

  if (error) {
  const err = error as Error;
  return <p>Error: {err.message}</p>;
  }

  const user = data?.currUser
  console.log(user)
  
  if (!data) return <p>No data</p>;

  return (
    <div className="text-white">
      <div className="flex justify-start items-center gap-4 mx-2">
         <IoMdArrowRoundBack />
         
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

       <h1 className="font-extrabold text-3xl mx-2 my-5">{user?.username}</h1> 
      </div> 
    </div>
  );
}