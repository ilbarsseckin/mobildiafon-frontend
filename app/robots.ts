import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Not: panel sayfalarinda noindex var. Google noindex'i gorebilmek icin
        // sayfayi tarayabilmeli, bu yuzden burada Disallow YOK.
        // Sayfalar dizinden dustukten sonra Disallow geri eklenebilir.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://mobildiafon.com/sitemap.xml",
    host: "https://mobildiafon.com",
  };
}
