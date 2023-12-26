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

export default function Page({ params }: { params: Params }) {
  const post = getPostByParams(params);

  if (!post) {
    throw new Error("Post not found");
  }

  return <PostContent html={post.html} />;
}
