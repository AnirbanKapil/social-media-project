import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa6";


export function Feeds ({content, userImg, user} : {content : string, userImg? : string | null, user : string}) {
   

    return(
        <div className="grid grid-cols-12 border-b border-gray-600">
            <div className="col-span-1">
                {userImg ? <Image alt="DP image" src={userImg} height={50} width={50}
                 className="rounded-full m-2" /> : <div className="w-12 h-12 rounded-full bg-blue-300 m-2"></div>}
            </div>
            <div className="col-span-11 m-2.5">
                <h1 className="font-semibold">{user}</h1>
                    <p>{content}</p>
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