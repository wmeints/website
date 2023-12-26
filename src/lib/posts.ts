import path from "path";
import fs from "fs";
import matter from "gray-matter";

interface Post {
  path: string;
  metadata: {
    title: string;
    category: string;
    dateCreated: string;
    datePublished: string;
  },
  content: string,
  params: {
    year: string;
    month: string;
    day: string;
    slug: string;
  }
}

export function getAllPosts(): Post[] {
  const rootDirectory = path.resolve("posts");
  const files = fs.readdirSync(rootDirectory)
    .flatMap(postDirectory => fs
      .readdirSync(path.join(rootDirectory, postDirectory))
      .map(file => path.join(rootDirectory, postDirectory, file)));

  return files.map(file => {
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
      content: article.content,
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
  return Array.from(new Set(posts.map(post => post.metadata.category)));
}

export const posts = getAllPosts();
export const categories = getAllCategories(posts);