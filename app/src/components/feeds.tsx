"use client"

import Image from "next/image";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaRegHeart , FaHeart} from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import Link from "next/link";
import { CldImage } from 'next-cloudinary'
import { useLikePostMutation } from "@/lib/generated";
import { useUnlikePostMutation } from "@/lib/generated";
import { useBookmarkPostMutation } from "@/lib/generated";
import { useUnbookmarkPostMutation } from "@/lib/generated";
import { useRepostPostMutation } from "@/lib/generated";
import { useUnrepostPostMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePostMutation } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DeletePostModal from "./post/DeletePostModal";
import EditPostModal from "./post/EditPostModal";
import { useMemo } from "react";

type RepostOriginal = {
  id: string;
  content: string;
  imgURLs?: string[] | null;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  repostsCount: number;
  commentsCount: number;
  author?: {
    id: string;
    username: string;
    profileImgUrl?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

export function Feeds ({content, userImg, user, imgSrcs, created, likesCount, isLiked, id, commentsCount,firstName, lastName, isDetailPage = false, isBookmarked, isReposted, repostsCount, repostOf} : 
    {content : string, userImg? : string | null,
     user : string, imgSrcs : string[], firstName?: string, lastName?: string 
      created : string, likesCount : number | undefined, isLiked : boolean | undefined, id: string, commentsCount: number | undefined
      isDetailPage?: boolean, isBookmarked?: boolean, isReposted?: boolean, repostsCount?: number,
      repostOf?: RepostOriginal | null
    }) {
    
    const { data } = useGetCurrentUserQuery({});
        
    const {mutateAsync: likePost} = useLikePostMutation();
    const {mutateAsync: unlikePost} = useUnlikePostMutation();
    const {mutateAsync: bookmarkPost} = useBookmarkPostMutation();
    const {mutateAsync: unbookmarkPost} = useUnbookmarkPostMutation();
    const {mutateAsync: repostPost} = useRepostPostMutation();
    const {mutateAsync: unrepostPost} = useUnrepostPostMutation();

    const deletePostMutation = useDeletePostMutation();

    const queryClient = useQueryClient();

    const currUser = data?.currUser;

    const original = repostOf ?? null;
    const targetId = original?.id ?? id;
    const displayUser = original?.author?.username ?? user;
    const displayFirstName = original ? original.author?.firstName ?? undefined : firstName;
    const displayLastName = original ? original.author?.lastName ?? undefined : lastName;
    const displayContent = original?.content ?? content;
    const displayCreated = original?.createdAt ?? created;
    const displayLikesCount = original ? original.likesCount : likesCount;
    const displayIsLiked = original ? original.isLiked : isLiked;
    const displayIsBookmarked = original ? original.isBookmarked : isBookmarked;
    const displayIsReposted = original ? original.isReposted : isReposted;
    const displayRepostsCount = original ? original.repostsCount : repostsCount;
    const displayCommentsCount = original ? original.commentsCount : commentsCount;
    
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [shareMsg, setShareMsg] = useState("");
    const [carouselState, setCarouselState] = useState({ postId: targetId, imageIndex: 0 });
    const postImages = useMemo(
      () => (original ? (original.imgURLs ?? []) : imgSrcs) ?? [],
      [original, imgSrcs],
    );
    const activeImageIndex = carouselState.postId === targetId ? carouselState.imageIndex : 0;
    const currentImageIndex = postImages.length ? activeImageIndex % postImages.length : 0;

    const showPreviousImage = () => {
        setCarouselState({
            postId: targetId,
            imageIndex: (currentImageIndex - 1 + postImages.length) % postImages.length,
        });
    };

    const showNextImage = () => {
        setCarouselState({
            postId: targetId,
            imageIndex: (currentImageIndex + 1) % postImages.length,
        });
    };

    const invalidatePostCaches = () => {
        queryClient.invalidateQueries({queryKey: ["GetAllPosts"]});
        queryClient.invalidateQueries({ queryKey: ['GetUserByUsername', { username : user }] });
        queryClient.invalidateQueries({queryKey: ["GetCurrentUser"]});
        queryClient.invalidateQueries({queryKey: ["GetPostById", { postId: targetId }]});
        queryClient.invalidateQueries({queryKey: ["GetBookmarkedPosts"]});
    };

    const handleLikeToggle = async () => {
        try {
            if (displayIsLiked) {
                await unlikePost({ postId: targetId }); 
            } else {
                await likePost({ postId: targetId });
            }
            invalidatePostCaches();
        } catch (error) {
            console.error("Failed to update like status:", error);
        }   
    };

    const handleBookmarkToggle = async () => {
        try {
            if (displayIsBookmarked) {
                await unbookmarkPost({ postId: targetId });
            } else {
                await bookmarkPost({ postId: targetId });
            }
            invalidatePostCaches();
        } catch (error) {
            console.error("Failed to update bookmark status:", error);
        }
    };

    const handleRepostToggle = async () => {
        try {
            if (displayIsReposted) {
                await unrepostPost({ postId: targetId });
            } else {
                await repostPost({ postId: targetId });
            }
            invalidatePostCaches();
        } catch (error) {
            console.error("Failed to update repost status:", error);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/dashboard/post/${targetId}`;
        try {
            if (typeof navigator !== "undefined" && navigator.share) {
                await navigator.share({ title: "Check out this post", url });
                return;
            }
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                setShareMsg("Link copied!");
                setTimeout(() => setShareMsg(""), 2000);
            }
        } catch (error) {
            console.error("Failed to share post:", error);
        }
    };
    
    const handleDeletePost = async () => {
        try {
          await deletePostMutation.mutateAsync({postId : id});
          queryClient.invalidateQueries({queryKey: ["GetAllPosts"]});
          queryClient.invalidateQueries({queryKey: ["GetPostById", { postId: id }]});
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
                   {original && (
                     <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                       <AiOutlineRetweet />
                       <span>{user} reposted</span>
                     </div>
                   )}
                   <div className="flex justify-between">
                    <div>
                      <Link href={`/dashboard/${displayUser}`}
                       className="inline-block font-semibold cursor-pointer hover:scale-110 transition-transform duration-300">
                       <p>{displayFirstName}</p>
                       <p>{displayLastName}</p>
                       <p>{displayUser}</p>
                      </Link>
                    </div>
                    <div className="flex">
                       <p className="text-slate-400 text-xs mt-2">{new Date(Number(displayCreated)).toLocaleString()}</p>
                       {!original && currUser?.username === user && (
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
                    {isDetailPage ? (
                      <p className="mt-2">{displayContent}</p>
                    ) : (
                      <Link href={`/dashboard/post/${targetId}`} className="mt-2 block">
                        <p>{displayContent}</p>
                      </Link>
                    )}
                    {postImages.length > 0 && (
                      <div className="relative mt-3">
                        {isDetailPage ? (
                          <CldImage
                            key={`${postImages[currentImageIndex]}-${currentImageIndex}`}
                            className="h-auto max-h-[32rem] w-full rounded-md object-contain"
                            alt={`Post image ${currentImageIndex + 1} of ${postImages.length}`}
                            src={postImages[currentImageIndex]}
                            width={1080}
                            height={1080}
                            crop="limit"
                          />
                        ) : (
                          <Link href={`/dashboard/post/${targetId}`} aria-label="Open post">
                            <CldImage
                              key={`${postImages[currentImageIndex]}-${currentImageIndex}`}
                              className="h-auto max-h-[32rem] w-full rounded-md object-contain"
                              alt={`Post image ${currentImageIndex + 1} of ${postImages.length}`}
                              src={postImages[currentImageIndex]}
                              width={1080}
                              height={1080}
                              crop="limit"
                            />
                          </Link>
                        )}
                        {postImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={showPreviousImage}
                              aria-label="Show previous image"
                              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                            >
                              <FiChevronLeft size={22} />
                            </button>
                            <button
                              type="button"
                              onClick={showNextImage}
                              aria-label="Show next image"
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                            >
                              <FiChevronRight size={22} />
                            </button>
                            <div
                              aria-live="polite"
                              aria-atomic="true"
                              className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm text-white"
                            >
                              {currentImageIndex + 1} / {postImages.length}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                <div className="relative mt-3 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 sm:w-1/2">
                    <div className="mt-0.5 cursor-pointer hover:scale-120 transition-transform duration-300">
                        <Link href={isDetailPage ? "#comments" : `/dashboard/post/${targetId}#comments`} aria-label="View comments">
                          <LuMessageCircle />
                        </Link>
                    </div>
                    <p>{displayCommentsCount}</p>
                    <div onClick={handleRepostToggle}
                     aria-label={displayIsReposted ? "Undo repost" : "Repost"}
                     className={`cursor-pointer hover:scale-120 transition-transform duration-300 ${displayIsReposted ? "text-green-500" : ""}`}>
                     <AiOutlineRetweet /></div>
                    <p className="text-xs">{displayRepostsCount}</p>
                    <div onClick={handleLikeToggle} 
                    className={`cursor-pointer hover:scale-120 transition-transform duration-300`}>
                    {displayIsLiked ? ( <FaHeart className="text-red-700" /> ) : (  <FaRegHeart className="" /> )}</div>
                    <p>{displayLikesCount}  Likes</p> 
                    <div onClick={handleShare}
                     aria-label="Share post"
                     className="cursor-pointer hover:scale-120 transition-transform duration-300"><BsUpload /></div>
                    <div onClick={handleBookmarkToggle}
                     aria-label={displayIsBookmarked ? "Remove bookmark" : "Bookmark"}
                     className="cursor-pointer hover:scale-120 transition-transform duration-300">
                     {displayIsBookmarked ? <FaBookmark className="text-blue-400" /> : <FaRegBookmark />}</div>
                    {shareMsg && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                        {shareMsg}
                      </span>
                    )}
                </div>    
            </div>
                {showEditModal && (
                  <EditPostModal
                  postId={id}
                  initialContent={content}
                  initialImgURLs={postImages}
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