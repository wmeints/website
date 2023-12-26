import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";

interface PostParams {
  year: string;
  month: string;
  day: string;
  slug: string;
}

interface Post {
  path: string;
  metadata: {
    title: string;
    category: string;
    dateCreated: string;
    datePublished: string;
  };
  html: string;
  markdown: string;
  params: PostParams;
}

export function getPostByParams(params: PostParams): Post | null {
  const filteredPosts = posts.filter(
    (x) =>
      x.params.year === params.year &&
      x.params.month === params.month &&
      x.params.day === params.day &&
      x.params.slug === params.slug
  );
  return (filteredPosts.length === 1 && filteredPosts[0]) || null;
}

export function renderMarkdown(markdownContent: string): string {
  return String(remark().use(prism).use(html).processSync(markdownContent));
}

export function getAllPosts(): Post[] {
  const rootDirectory = path.resolve("posts");
  const files = fs
    .readdirSync(rootDirectory)
    .flatMap((postDirectory) =>
      fs
        .readdirSync(path.join(rootDirectory, postDirectory))
        .map((file) => path.join(rootDirectory, postDirectory, file))
    );

  return files.map((file) => {
    const slug = path.basename(file).replace(/\.md$/, "");
    const url = path.basename(path.dirname(file));

    const [year, month, day] = url.split("-");
    const article = matter(fs.readFileSync(file));

    return {
      path: file,
      metadata: {
        datePublished: article.data.datePublished,
        dateCreated: article.data.dateCreated,
        category: article.data.category,
        title: article.data.title,
      },
      markdown: article.content,
      html: renderMarkdown(article.content),
      params: {
        year,
        month,
        day,
        slug,
      },
    };
  });
}

export function getAllCategories(posts: Post[]): string[] {
  return Array.from(new Set(posts.map((post) => post.metadata.category)));
}

export const posts = getAllPosts();
export const categories = getAllCategories(posts);
