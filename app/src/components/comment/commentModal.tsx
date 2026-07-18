
import { IoClose } from "react-icons/io5";
import { CommentSection } from "./commentSection";


type Props = {
   postId : string,
   onClose : () => void,
}



export function CommentModal ({postId, onClose} : Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
         onClick={onClose}>
          <div
          className="bg-black border border-gray-700 rounded-2xl w-[600px] h-[700px] flex flex-col"
          onClick={(e) => e.stopPropagation()}></div>
           <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">
             Comments
             </h2>

             <button onClick={onClose}>
             <IoClose size={24} />
             </button>
               <div className="flex-1 overflow-y-auto">
                <CommentSection postId={postId} />
               </div>
            </div>
        </div>
    )
}