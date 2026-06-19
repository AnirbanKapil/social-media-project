"use client"

import { useState } from "react"
import { Card } from "../src/components/card"
import axios from "axios";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";




export default  function SignUp () {
  const router = useRouter();
  const [user , setUser] = useState({
    username : "",
    password : "",
    email : "",
    profileImgUrl : ""
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
                   <CldUploadWidget
                     uploadPreset="profile-images"
                     options={{
                     cropping: true,
                     croppingAspectRatio: 1,
                     sources: ["local"],
                     }}
                     onSuccess={(result: any) => {
                        const imageUrl = result?.info?.secure_url;
                         setUser((prev) => ({
                         ...prev,
                         profileImgUrl: imageUrl,
                         }));
                      }}
                     >
                    {({ open }) => {
                     return (
                      <button
                       type="button"
                       onClick={() => open()}
                       className="border border-gray-300 rounded-lg mb-4 p-2 m-3"
                      >
                      Upload Profile Image
                      </button>
                      );
                    }}
                   </CldUploadWidget>
                   
                     {user.profileImgUrl && (
                           <Image
                           src={user.profileImgUrl}
                           alt="Profile Preview"
                           width={200}
                           height={200}
                           className="w-24 h-24 rounded-full object-cover mx-auto my-3"
                           />
                     )}
                  <button className="border border-gray-300 rounded-lg mb-4 p-2 m-3" onClick={handleSubmit}>
                  SignUp
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