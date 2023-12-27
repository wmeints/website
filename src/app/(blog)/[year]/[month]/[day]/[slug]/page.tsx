import { getPostByParams, posts } from "@/lib/posts";
import PostContent from "@/components/PostContent";

export function generateStaticParams() {
  return posts.map((post) => post.params);
}

interface Params {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export function generateMetadata({ params }: { params: Params }) {
  const post = getPostByParams(params);

  if (!post) {
    throw new Error("Post not found");
  }

  return {
    title: `${post.metadata.title} - Willem's Fizzy Logic`,
  };
}

export default function Page({ params }: { params: Params }) {
  const post = getPostByParams(params);

  if (!post) {
    throw new Error("Post not found");
  }

  return (
    <>
      <h1 className="text-2xl font-bold lg:text-5xl">{post.metadata.title}</h1>
      <div className="mt-3 lg:mt-12">
        <PostContent html={post.html} />
      </div>
    </>
  );
}
