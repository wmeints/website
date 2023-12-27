import "prismjs/themes/prism-tomorrow.css";

interface PostContentProps {
  html: string;
}
export default function PostContent({ html }: PostContentProps) {
  return (
    <div
      className="prose prose-sm max-w-none lg:prose-lg dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
