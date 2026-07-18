
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
          className="relative flex h-[700px] w-[600px] flex-col overflow-hidden rounded-2xl border border-gray-700 bg-black"
          onClick={(e) => e.stopPropagation()}>
           <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">
             Comments
             </h2>

             <button onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-800">
             <IoClose size={24} />
             </button>
               <div className="flex-1 overflow-y-auto">
                <CommentSection postId={postId} />
               </div>
            </div>
          </div>  
        </div>
    )
}