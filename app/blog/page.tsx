import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getAllCategories } from "../../lib/posts";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog | MobilDiafon — Dijital Diafon ve Akıllı Bina Rehberi",
  description:
    "Apartman diafonu, akıllı kapı sistemleri, site güvenliği ve dijital interkom hakkında güncel rehberler, ipuçları ve haberler.",
  alternates: { canonical: "https://mobildiafon.com/blog" },
  openGraph: {
    title: "MobilDiafon Blog",
    description: "Dijital diafon ve akıllı bina çözümleri rehberi.",
    url: "https://mobildiafon.com/blog",
    type: "website",
  },
};

const fmtDate = (d: string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
};

export default function BlogPage({ searchParams }: { searchParams: { kategori?: string } }) {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const activeCat = searchParams?.kategori || "";

  const filtered = activeCat ? posts.filter((p) => p.category === activeCat) : posts;
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <main className="blog">
      {/* Header */}
      <header className="blog-top">
        <div className="blog-wrap blog-top-inner">
          <Link href="/" className="blog-logo">Mobil<b>Diafon</b></Link>
          <Link href="/" className="blog-back">← Ana sayfa</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="blog-hero">
        <div className="blog-wrap">
          <span className="blog-eyebrow">Blog</span>
          <h1>Dijital Diafon ve Akıllı Bina Rehberi</h1>
          <p>Apartman güvenliği, akıllı kapı sistemleri ve dijital interkom hakkında bilmeniz gereken her şey.</p>
        </div>
      </section>

      <div className="blog-wrap">
        {/* Kategori filtresi */}
        <nav className="blog-cats">
          <Link href="/blog" className={!activeCat ? "active" : ""}>Tümü</Link>
          {categories.map((c) => (
            <Link key={c} href={`/blog?kategori=${encodeURIComponent(c)}`} className={activeCat === c ? "active" : ""}>
              {c}
            </Link>
          ))}
        </nav>

        {posts.length === 0 ? (
          <div className="blog-empty">Henüz yazı eklenmedi.</div>
        ) : (
          <>
            {/* Öne çıkan yazı */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="blog-featured">
                <div className="blog-featured-body">
                  <span className="blog-cat-tag">{featured.category}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.description}</p>
                  <div className="blog-meta">
                    <span>{fmtDate(featured.date)}</span>
                    <span>·</span>
                    <span>{featured.readingTime} dk okuma</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Diğer yazılar grid */}
            <div className="blog-grid">
              {rest.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
                  <span className="blog-cat-tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="blog-meta">
                    <span>{fmtDate(p.date)}</span>
                    <span>·</span>
                    <span>{p.readingTime} dk</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer mini */}
      <footer className="blog-footer">
        <div className="blog-wrap">
          <span>© 2026 MobilDiafon</span>
          <Link href="/">Ana sayfaya dön</Link>
        </div>
      </footer>
    </main>
  );
}
