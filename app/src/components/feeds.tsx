import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa6";

export function Feeds () {
    return(
        <div className="grid grid-cols-12">
            <div className="col-span-1">
                <Image alt="DP image" src="https://avatars.githubusercontent.com/u/131807985?v=4" height={50} width={50} 
                    className="rounded-full p-1 pt-2"/>
            </div>
            <div className="col-span-11 m-2">
                <h1 className="font-semibold">User001</h1>
                <p>Coding in the AI era isn’t about writing every line — it’s about knowing what to ask, what to build, and how to think.
                   The future belongs to those who collaborate with machines, not compete with them. 🤖⚡ #AI #Coding #DeveloperMindset</p>
                <div className="flex justify-between items-center mt-2 w-1/2">
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><LuMessageCircle /></div>
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><AiOutlineRetweet /></div>
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><FaRegHeart /></div>
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><BsUpload /></div>
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><FaRegBookmark /></div>
                </div>    
            </div>
        </div>
    )
}