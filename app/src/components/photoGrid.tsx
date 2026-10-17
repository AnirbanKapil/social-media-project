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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {tiles.map(({ post, src, index }) => (
        <Link
          key={`${post.id}-${index}`}
          href={`/dashboard/post/${post.id}`}
          aria-label={post.content ? `Open post: ${post.content.slice(0, 60)}` : "Open post"}
          className="relative block aspect-[4/5] overflow-hidden rounded-md"
        >
          <CldImage
            src={src}
            alt={post.content?.slice(0, 80) || "Post image"}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
