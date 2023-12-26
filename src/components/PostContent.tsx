interface PostContentProps {
  html: string;
}
export default function PostContent({ html }: PostContentProps) {
  return <div className="prose prose-lg dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }}></div>;
}
