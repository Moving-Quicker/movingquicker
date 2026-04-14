import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  keywords: string[];
  image?: string;
  published: boolean;
  readingTime: string;
  content: string;
}

export interface BlogPostMeta extends Omit<BlogPost, "content"> {}

function parseFrontmatter(slug: string, source: string): BlogPost {
  const { data, content } = matter(source);
  const rt = readingTime(content);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString(),
    author: data.author ?? "Jorge Sarricolea",
    tags: data.tags ?? [],
    keywords: data.keywords ?? data.tags ?? [],
    image: data.image,
    published: data.published !== false,
    readingTime: rt.text.replace("read", "lectura"),
    content,
  };
}

/** Pulls Q&A pairs from the MDX body after `## Preguntas frecuentes` until the next `##` heading. */
export function extractFaqs(content: string): { question: string; answer: string }[] {
  const header = "## Preguntas frecuentes";
  const start = content.indexOf(header);
  if (start === -1) return [];

  let cursor = start + header.length;
  while (cursor < content.length && /[\r\n\s]/.test(content[cursor])) cursor++;

  const rest = content.slice(cursor);
  const endMatch = rest.match(/^## (?![#])/m);
  const section = endMatch?.index != null ? rest.slice(0, endMatch.index) : rest;

  const faqs: { question: string; answer: string }[] = [];
  const lines = section.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      const question = line.slice(4).trim();
      i++;
      while (i < lines.length && lines[i].trim() === "") i++;
      const answerLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("###")) {
        answerLines.push(lines[i]);
        i++;
      }
      const answer = answerLines.join("\n").trim();
      if (question && answer) faqs.push({ question, answer });
      continue;
    }
    i++;
  }
  return faqs;
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { content: _, ...meta } = parseFrontmatter(slug, raw);
      return meta;
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf-8");
  const post = parseFrontmatter(slug, raw);
  if (!post.published) return null;
  return post;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}
