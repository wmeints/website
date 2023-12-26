import { posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map(post => post.params);
}

interface Params {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export default function Page({ params }: { params: Params }) {
  return <h1>Hello</h1>;
}