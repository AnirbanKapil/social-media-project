
"use client";

import { useGetCurrentUserQuery } from "@/lib/generated";


export default function UsersPage() {
  const { data, isLoading, error } = useGetCurrentUserQuery({});
  
  if (isLoading) return <p>Loading...</p>;

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
    </div>
  );
}