import type { Metadata } from "next";
import Browse from "@/components/Browse";
import { channels, categories } from "@/lib/channels";
import { categoryMeta } from "@/lib/categoryMeta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} — Live TV Channels`,
    numberOfItems: channels.length,
    itemListElement: channels.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/watch/${c.slug}`,
      name: c.name,
    })),
  };

  const catCount = categories.filter((c) => channels.some((ch) => ch.category === c)).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <section className="hero">
        <div className="container">
          <h1>
            বাংলাদেশি <span className="hl">টিভি চ্যানেল</span> লাইভ দেখুন — ফ্রি ও HD
          </h1>
          <p>
            Watch {channels.length}+ Bangladeshi & popular live TV channels online — news, drama,
            sports, movies, music and more. দ্রুত, মোবাইল ফ্রেন্ডলি, কোনো অ্যাপ বা সাইন-আপ লাগবে না।
          </p>
          <div className="hero__stats">
            <div className="stat">
              <strong>{channels.length}+</strong>
              <span>Live Channels</span>
            </div>
            <div className="stat">
              <strong>{catCount}</strong>
              <span>Categories</span>
            </div>
            <div className="stat">
              <strong>HD</strong>
              <span>Free Streaming</span>
            </div>
          </div>
        </div>
      </section>

      <Browse channels={channels} />

      {/* SEO supporting copy (crawlable) */}
      <section className="container" style={{ padding: "30px 16px 10px", color: "var(--muted)" }}>
        <h2 style={{ color: "var(--text)", fontSize: "1.15rem" }}>
          BDTV Live — বাংলাদেশের সব টিভি চ্যানেল এক জায়গায়
        </h2>
        <p style={{ maxWidth: 820 }}>
          BDTV Live-এ আপনি {channels.length}টিরও বেশি লাইভ টিভি চ্যানেল ফ্রিতে দেখতে পারবেন।{" "}
          {categories
            .filter((c) => channels.some((ch) => ch.category === c))
            .map((c) => `${categoryMeta[c].bn} (${c})`)
            .join(", ")}{" "}
          — প্রতিটি ক্যাটাগরিতে সাজানো যাতে আপনি সহজেই আপনার পছন্দের চ্যানেলটি খুঁজে পান। সব স্ট্রিম
          মোবাইল ও ডেস্কটপে কাজ করে।
        </p>
      </section>
    </>
  );
}
