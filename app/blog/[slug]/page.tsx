import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "../../../lib/posts";
import "../blog.css";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Yazı bulunamadı | MobilDiafon" };
  return {
    title: `${post.title} | MobilDiafon Blog`,
    description: post.description,
    alternates: { canonical: `https://mobildiafon.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://mobildiafon.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

const fmtDate = (d: string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
};

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // JSON-LD structured data (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "MobilDiafon",
      logo: { "@type": "ImageObject", url: "https://mobildiafon.com/icon-512.png" },
    },
    mainEntityOfPage: `https://mobildiafon.com/blog/${post.slug}`,
  };

  return (
    <main className="blog">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="blog-top">
        <div className="blog-wrap blog-top-inner">
          <Link href="/" className="blog-logo">Mobil<b>Diafon</b></Link>
          <Link href="/blog" className="blog-back">← Tüm yazılar</Link>
        </div>
      </header>

      <article className="blog-article">
        <div className="blog-wrap blog-article-wrap">
          <span className="blog-cat-tag">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="blog-article-meta">
            <span>{post.author}</span>
            <span>·</span>
            <span>{fmtDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} dk okuma</span>
          </div>

          <div className="blog-content">
            <MDXRemote source={post.content} />
          </div>

          {/* CTA */}
          <div className="blog-cta">
            <h3>Binanızı dijitalleştirmeye hazır mısınız?</h3>
            <p>QR ve konum tabanlı dijital diafon ile binanızın giriş deneyimini modernleştirin.</p>
            <Link href="/satin-al" className="blog-cta-btn">14 Gün Ücretsiz Dene</Link>
          </div>
        </div>
      </article>

      <footer className="blog-footer">
        <div className="blog-wrap">
          <span>© 2026 MobilDiafon</span>
          <Link href="/blog">Blog'a dön</Link>
        </div>
      </footer>
    </main>
  );
}
