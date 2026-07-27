"use client";



type Props = {
  onClose: () => void;
  onDelete: () => void;
};




export default function DeletePostModal ({onClose, onDelete} : Props) {
 return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[420px] rounded-2xl bg-black border border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold">
          Delete Post
        </h2>

        <p className="mt-4 text-gray-400">
          Are you sure you want to delete this post?
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-5 py-2 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}