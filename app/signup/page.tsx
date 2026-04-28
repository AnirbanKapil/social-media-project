"use client"

import { useState } from "react"
import { Card } from "../src/components/card"
import axios from "axios";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { signIn } from "next-auth/react";



export default  function SignUp () {
  
  const router = useRouter();
  const [user , setUser] = useState({
    username : "",
    password : "",
    email : ""
  });

  const handleSubmit =async () =>{
    try {
      await axios.post("/api/auth/register",user);
      setTimeout(()=>{
                router.push("/api/auth/signin") 
             },2000)
    } catch (error : any) {
      console.log(error)
      return null;
    }
  }
  
  return (
        <div className="">
            <Card title="SignUp">
              <div className="flex flex-col">
                 <input className="m-2 p-3 border-b-2 " type="text" placeholder="username" value={user.username} 
                 onChange={(e)=> setUser({...user , username : e.target.value})}/> 
                 <input className="m-2 p-3 border-b-2" type="text" placeholder="email" value={user.email} 
                 onChange={(e)=> setUser({...user , email : e.target.value})}/> 
                 <input className="m-2 p-3 border-b-2" type="password" placeholder="password" value={user.password} 
                 onChange={(e) => setUser({...user , password : e.target.value})}/> 
                 <button className="border border-gray-300 rounded-lg mb-4 p-2 m-3" onClick={handleSubmit}>
                  SignUp
                  </button>
                  <button className="bg-blue-500 p-2 m-2 cursor-pointer" onClick={() => signIn("google")}>
                    Sign in with Google
                  </button>
                  <div>
                    <p className="font-semibold">Already have an account ???</p> 
                    <p className="mt-3">Visit  <Link className="mx-3 bg-blue-400 rounded-lg p-2" href="/api/auth/signin">SignIn Page</Link></p> 
                  </div>
              </div>
            </Card>
        </div>
      )     
}