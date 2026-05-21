

"use client";

import { useGetCurrentUserQuery } from "@/lib/generated";
import Image from "next/image";
import { Loader } from "@/app/src/components/loader";


export default function UsersPage() {
  const { data, isLoading, error } = useGetCurrentUserQuery({});
  
  if (isLoading) return <Loader />;

  if (error) {
  const err = error as Error;
  return <p>Error: {err.message}</p>;
  }

  const user = data?.currUser
  
  if (!data) return <p>No data</p>;

  return (
    <div className="text-slate-700">
      <h1>Welcome, {user?.username}</h1>
      <p>Email: {user?.email}</p>
      {user?.profileImgUrl ? (
          <Image
           alt="profileImg"
           src={user.profileImgUrl}
           width={100}
           height={100}
  />
) : null}
    </div>
  );
}