import { useGetCommentsQuery } from "@/lib/generated";
import { Loader } from "../loader";
import { useState } from "react";
import { useCreateCommentMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";


type Props = {
  postId: string;
};

export function CommentSection ({postId} : Props) {
    const { data, isLoading } =useGetCommentsQuery({postId,});
    const [content, setContent] = useState("");
    
    const createCommentMutation = useCreateCommentMutation();

    const queryClient = useQueryClient();

    if (isLoading) return <Loader />;

    const handleComment = async () => {
       if (!content.trim()) return;

      await createCommentMutation.mutateAsync({
      postId,
      content,
      });
      setContent("");
      queryClient.invalidateQueries({queryKey: ["GetComments"],});
      queryClient.invalidateQueries({queryKey: ["GetAllPosts"],});
    }

    return(
      <div className="flex h-full flex-col mt-1.5">
        {data?.getComments.map((comment) => (
        <div key={comment.id}>
            <div className="flex gap-3 mb-6">

    {comment?.author?.profileImgUrl ? 
    <Image alt="DP image" src={comment?.author?.profileImgUrl} height={50} width={50} className="rounded-full m-2 w-12 h-12" /> : 
    <div className="w-10 h-10 mx-2 rounded-full bg-gray-600"></div>}
    <div>
        <div className="flex gap-2 items-center mt-2">
            <p className="font-semibold">
                {comment?.author?.username}
            </p>
         </div>
           <p>{comment?.content}</p>
          </div>
         </div>
        </div>
        ))}
        <div className="flex gap-3">
        <input value={content}
         className="flex-1 rounded-full border border-gray-600 bg-transparent px-4 py-2 outline-none ml-1"
         onChange={(e) => setContent(e.target.value)}/>
         <button className="rounded-full mr-1 bg-blue-500 px-5 py-2 text-white" 
          onClick={handleComment}>Comment</button>
        </div>
      </div>
    )
};

