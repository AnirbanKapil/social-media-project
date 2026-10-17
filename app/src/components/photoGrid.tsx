import Link from "next/link";
import { CldImage } from "next-cloudinary";

type MediaPost = {
  id: string;
  content: string;
  imgURL?: string | null;
  imgURLs: string[];
};

export function PhotoGrid({ posts }: { posts: MediaPost[] }) {
  const tiles = posts.flatMap((post) => {
    const images = post.imgURLs?.length ? post.imgURLs : post.imgURL ? [post.imgURL] : [];
    return images.map((src, index) => ({ post, src, index }));
  });

  return (
    <div className="columns-2 gap-1 sm:columns-3 md:columns-4">
      {tiles.map(({ post, src, index }) => (
        <Link
          key={`${post.id}-${index}`}
          href={`/dashboard/post/${post.id}`}
          aria-label={post.content ? `Open post: ${post.content.slice(0, 60)}` : "Open post"}
          className="mb-1 block break-inside-avoid"
        >
          <CldImage
            src={src}
            alt={post.content?.slice(0, 80) || "Post image"}
            width={600}
            height={600}
            crop="limit"
            className="w-full rounded-md"
          />
        </Link>
      ))}
    </div>
  );
}
