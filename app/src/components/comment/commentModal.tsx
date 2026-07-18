
import { IoClose } from "react-icons/io5";
import { CommentSection } from "./commentSection";


type Props = {
   postId : string,
   onClose : () => void,
}



export function CommentModal ({postId, onClose} : Props) {
   return (
  <div 
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    onClick={onClose}
  >
    <div className="relative">
      <button 
        onClick={onClose}
        className="absolute -top-12 -right-4 md:-right-12 rounded-full p-2 bg-black/30 hover:bg-white/10 text-white transition-colors"
        aria-label="Close modal"
      >
        <IoClose size={28} />
      </button>
      <div className="flex h-[700px] w-[600px] flex-col overflow-hidden rounded-2xl border border-gray-700 bg-black"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Comments</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CommentSection postId={postId} />
        </div>

      </div>  
    </div>
  </div>
)
}