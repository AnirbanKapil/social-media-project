import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa6";
import Link from "next/link";
import { CldImage } from 'next-cloudinary'


export function Feeds ({content, userImg, user, imgSrc} : {content : string, userImg? : string | null, user : string, imgSrc : string}) {
   

    return(
        <div className="grid grid-cols-12 border-b border-gray-600">
            <div className="col-span-1">
                {userImg ? <Image alt="DP image" src={userImg} height={50} width={50}
                 className="rounded-full m-2" /> : <div className="w-12 h-12 rounded-full bg-blue-300 m-2"></div>}
            </div>
            <div className="col-span-11 m-2.5">
                   <Link href={`/dashboard/${user}`}
                    className="inline-block font-semibold cursor-pointer hover:scale-110 transition-transform duration-300">
                       {user}
                    </Link>
                    <p>{content}</p>
                    {imgSrc && <CldImage
                    alt="image"
                    src={imgSrc}
                    width={1080}
                    height={1080}
                    crop="fill"
                    gravity="auto"
                    />}
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