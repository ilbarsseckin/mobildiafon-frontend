import type { MetadataRoute } from "next";
import { getAllPosts } from "../lib/posts";

const BASE = "https://mobildiafon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sayfalar: { yol: string; oncelik: number; siklik: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { yol: "", oncelik: 1.0, siklik: "weekly" },
    { yol: "/auto", oncelik: 0.95, siklik: "weekly" },
    { yol: "/satin-al", oncelik: 0.9, siklik: "weekly" },
    { yol: "/arac-siparis", oncelik: 0.9, siklik: "weekly" },
    { yol: "/blog", oncelik: 0.7, siklik: "weekly" },
    { yol: "/iletisim", oncelik: 0.6, siklik: "monthly" },
    { yol: "/kvkk", oncelik: 0.3, siklik: "yearly" },
    { yol: "/gizlilik", oncelik: 0.3, siklik: "yearly" },
    { yol: "/kullanim-sartlari", oncelik: 0.3, siklik: "yearly" },
    { yol: "/mesafeli-satis", oncelik: 0.3, siklik: "yearly" },
  ];

  const statik = sayfalar.map((s) => ({
    url: BASE + s.yol,
    lastModified: now,
    changeFrequency: s.siklik,
    priority: s.oncelik,
  }));

  let yazilar: MetadataRoute.Sitemap = [];
  try {
    yazilar = getAllPosts().map((post: any) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    yazilar = [];
  }

  return [...statik, ...yazilar];
}
