"use client"

import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart , FaHeart} from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa6";
import Link from "next/link";
import { CldImage } from 'next-cloudinary'
import { useLikePostMutation } from "@/lib/generated";
import { useUnlikePostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePostMutation } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import DeletePostModal from "./post/DeletePostModal";
import EditPostModal from "./post/EditPostModal";

export function Feeds ({content, userImg, user, imgSrc, created, likesCount, isLiked, id, commentsCount,firstName, lastName, onCommentClick} : 
    {content : string, userImg? : string | null,
     user : string, imgSrc : string | null |  undefined, firstName : string, lastName : string 
      created : string, likesCount : number | undefined, isLiked : boolean | undefined, id: string, commentsCount: number | undefined
      onCommentClick : () => void 
    }) {
    
    const { data } = useGetCurrentUserQuery({});
        
    const {mutateAsync: likePost} = useLikePostMutation();
    const {mutateAsync: unlikePost} = useUnlikePostMutation();

    const deletePostMutation = useDeletePostMutation();

    const queryClient = useQueryClient();

    const currUser = data?.currUser
    
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleLikeToggle = async () => {
        try {
            if (isLiked) {
                await unlikePost({ postId: id }); 
            } else {
                await likePost({ postId: id });
            }
            queryClient.invalidateQueries({queryKey: ["GetAllPosts"]});
            queryClient.invalidateQueries({ queryKey: ['GetUserByUsername', { username : user }] });
            queryClient.invalidateQueries({queryKey: ["GetCurrentUser"]});
        } catch (error) {
            console.error("Failed to update like status:", error);
        }   
    };
    
    const handleDeletePost = async () => {
        try {
          await deletePostMutation.mutateAsync({postId : id});
          queryClient.invalidateQueries({queryKey: ["GetAllPosts"]});  
        } catch (error) {
          console.error("Failed to delete post:", error);  
        }
    }

    return(
        <div className="grid grid-cols-12 border-b border-gray-600">
            <div className="col-span-1">
                {userImg ? <Image alt="DP image" src={userImg} height={50} width={50}
                 className="rounded-full m-2 w-12 h-12" /> : <div className="w-12 h-12 rounded-full bg-blue-300 m-2"></div>}
            </div>
            <div className="col-span-11 m-2.5">
                   <div className="flex justify-between">
                    <div>
                      <Link href={`/dashboard/${user}`}
                       className="inline-block font-semibold cursor-pointer hover:scale-110 transition-transform duration-300">
                       <p>{firstName}</p>
                       <p>{lastName}</p>
                       <p>{user}</p>
                      </Link>
                    </div>
                    <div className="flex">
                       <p className="text-slate-400 text-xs mt-2">{new Date(Number(created)).toLocaleString()}</p>
                       {currUser?.username === user && (
                         <div className="relative">
                          <button onClick={() => setShowMenu((prev) => !prev)} 
                          className="p-2 rounded-full hover:bg-gray-800">
                          <BsThreeDots size={18} /></button>
                          {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-700 bg-black shadow-lg">
                              <button
                               onClick={() => {
                               setShowMenu(false);
                               setShowEditModal(true);
                               }}
                               className="w-full px-4 py-3 text-left hover:bg-gray-800"
                               >
                                Edit Post
                              </button>
                              <button
                               onClick={()=> {
                                  setShowMenu(false);
                                  setShowDeleteModal(true);
                               }}
                                className="w-full px-4 py-3 text-left text-red-500 hover:bg-gray-800"
                              >
                                 Delete Post
                              </button> 
                            </div>
                          )}
                         </div>    
                        )
                       }
                    </div>
                  </div>
                    <p className="mt-2">{content}</p>
                    {imgSrc && <CldImage
                    className="rounded-md"
                    alt="image"
                    src={imgSrc}
                    width={1080}
                    height={1080}
                    crop="fill"
                    gravity="auto"
                    />}
                    
                <div className="flex justify-between items-center mt-2 w-1/2">
                    <div className="mt-0.5 cursor-pointer hover:scale-120 transition-transform duration-300">
                        <button onClick={onCommentClick}><LuMessageCircle /></button>
                    </div>
                    <p>{commentsCount}</p>
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><AiOutlineRetweet /></div>
                    <div onClick={handleLikeToggle} 
                    className={`cursor-pointer hover:scale-120 transition-transform duration-300`}>
                    {isLiked ? ( <FaHeart className="text-red-700" /> ) : (  <FaRegHeart className="" /> )}</div>
                    <p>{likesCount}  Likes</p> 
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><BsUpload /></div>
                    <div className="cursor-pointer hover:scale-120 transition-transform duration-300"><FaRegBookmark /></div>
                </div>    
            </div>
                {showEditModal && (
                  <EditPostModal
                  postId={id}
                  initialContent={content}
                  initialImgURL={imgSrc}
                  onClose={() => setShowEditModal(false)}
                />
                )} 
                {showDeleteModal && (
                  <DeletePostModal
                  onClose={() => setShowDeleteModal(false)}
                  onDelete={async () => {
                  await handleDeletePost();
                  setShowDeleteModal(false);
                  }}
                />
          )}
        </div>
    )
}