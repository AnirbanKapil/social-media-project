import { useGetCommentsQuery } from "@/lib/generated";
import { Loader } from "../loader";
import { useState } from "react";
import { useCreateCommentMutation } from "@/lib/generated";
import { useDeleteCommentMutation } from "@/lib/generated";
import { useGetCurrentUserQuery } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";


type Props = {
  postId: string;
};

export function CommentSection ({postId} : Props) {
    const { data, isLoading } =useGetCommentsQuery({postId,});
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    
    const createCommentMutation = useCreateCommentMutation();
    const deleteCommentMutation = useDeleteCommentMutation();
    const { data: currentUserData } = useGetCurrentUserQuery({});

    const queryClient = useQueryClient();

    if (isLoading) return <Loader />;

    const handleComment = async () => {
       if (!content.trim()) return;

      try {
        await createCommentMutation.mutateAsync({
          postId,
          content,
        });
        setContent("");
        await queryClient.invalidateQueries({queryKey: ["GetComments"],});
        await queryClient.invalidateQueries({queryKey: ["GetAllPosts"],});
        await queryClient.invalidateQueries({queryKey: ["GetPostById", { postId }],});
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to add comment");
      }
    }

    const handleDeleteComment = async (commentId: string) => {
      try {
        await deleteCommentMutation.mutateAsync({ commentId });
        await queryClient.invalidateQueries({queryKey: ["GetComments", { postId }]});
        await queryClient.invalidateQueries({queryKey: ["GetAllPosts"]});
        await queryClient.invalidateQueries({queryKey: ["GetPostById", { postId }]});
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to delete comment");
      }
    }

    return(
      <div className="flex h-full flex-col mt-1.5">
        {data?.getComments.map((comment) => (
        <div key={comment.id}>
            <div className="flex gap-3 mb-6">

    {comment?.author?.profileImgUrl ? 
    <Image alt="DP image" src={comment?.author?.profileImgUrl} height={50} width={50} className="rounded-full m-2 w-12 h-12" /> : 
    <div className="w-10 h-10 mx-2 rounded-full bg-gray-600"></div>}
    <div className="min-w-0 flex-1">
        <div className="flex gap-2 items-center mt-2">
            <p className="font-semibold">
                {comment?.author?.username}
            </p>
            {(comment.author.id === currentUserData?.currUser?.id
              || comment.postOwnerId === currentUserData?.currUser?.id) && (
              <button
                type="button"
                onClick={() => handleDeleteComment(comment.id)}
                disabled={deleteCommentMutation.isPending}
                className="ml-auto text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                aria-label={`Delete comment by ${comment.author.username}`}
              >
                Delete
              </button>
            )}
         </div>
           <p>{comment?.content}</p>
          </div>
         </div>
        </div>
        ))}
        {error && <p role="alert" className="mb-2 text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
        <input value={content}
         className="flex-1 rounded-full border border-gray-600 bg-transparent px-4 py-2 outline-none ml-1"
         onChange={(e) => setContent(e.target.value)}
         onKeyDown={(e) => {
           if (e.key === "Enter") {
             e.preventDefault();
             void handleComment();
           }
         }}/>
         <button className="rounded-full mr-1 bg-blue-500 px-5 py-2 text-white disabled:opacity-50"
          disabled={createCommentMutation.isPending || !content.trim()}
          onClick={handleComment}>Comment</button>
        </div>
      </div>
    )
};
