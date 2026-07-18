import { useGetCommentsQuery } from "@/lib/generated";
import { Loader } from "../loader";
import { useState } from "react";
import { useCreateCommentMutation } from "@/lib/generated";
import { useQueryClient } from "@tanstack/react-query";



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
      <div>
        {data?.getComments.map((comment) => (
        <div key={comment.id}>
        <p>{comment.author.username}</p>
        <p>{comment.content}</p>
        </div>
        ))}
        <input value={content}
         onChange={(e) => setContent(e.target.value)}/>
         <button onClick={handleComment}>Comment</button>
      </div>
    )
};