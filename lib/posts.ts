import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  cover?: string;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

// Okuma süresi tahmini (200 kelime/dk)
function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Tüm yazıların meta bilgisi (liste için)
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      category: data.category || "Genel",
      date: data.date || "",
      author: data.author || "MobilDiafon",
      cover: data.cover || null,
      readingTime: estimateReadingTime(content),
    } as PostMeta;
  });

  // Tarihe göre yeniden eskiye sırala
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Tek yazı (içerik dahil)
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    category: data.category || "Genel",
    date: data.date || "",
    author: data.author || "MobilDiafon",
    cover: data.cover || null,
    readingTime: estimateReadingTime(content),
    content,
  };
}

// Tüm kategoriler (benzersiz)
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const cats = new Set(posts.map((p) => p.category));
  return Array.from(cats);
}

// Slug listesi (static params için)
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
