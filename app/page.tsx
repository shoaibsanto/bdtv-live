import type { Metadata } from "next";
import Link from "next/link";
import Browse from "@/components/Browse";
import ChannelCard from "@/components/ChannelCard";
import { channels, categories } from "@/lib/channels";
import { categoryMeta } from "@/lib/categoryMeta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const sports = channels.filter((c) => c.category === "Sports");
  const activeCats = categories.filter((c) => channels.some((ch) => ch.category === c));

  const graphLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.descriptionEn,
        inLanguage: ["bn", "en"],
        publisher: { "@id": `${site.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${site.url}/?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/#webpage`,
        url: site.url,
        name: site.title,
        isPartOf: { "@id": `${site.url}/#website` },
        about: `${channels.length} live TV channels in ${activeCats.length} categories`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: channels.length,
          itemListElement: channels.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}/watch/${c.slug}`,
            name: `${c.name} Live`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphLd) }} />

      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <h1 id="hero-heading">
            বাংলাদেশি <span className="hl">টিভি চ্যানেল</span> লাইভ দেখুন — ফ্রি ও HD
          </h1>
          <p>
            Watch {channels.length}+ Bangladeshi &amp; popular live TV channels online — news, drama,
            sports, movies, music and more. দ্রুত, মোবাইল ফ্রেন্ডলি, কোনো অ্যাপ বা সাইন-আপ লাগবে না।
          </p>
          <dl className="hero__stats">
            <div className="stat">
              <dt className="sr-only">Live channels</dt>
              <dd><strong>{channels.length}+</strong><span>Live Channels</span></dd>
            </div>
            <div className="stat">
              <dt className="sr-only">Categories</dt>
              <dd><strong>{activeCats.length}</strong><span>Categories</span></dd>
            </div>
            <div className="stat">
              <dt className="sr-only">Quality</dt>
              <dd><strong>HD</strong><span>Free Streaming</span></dd>
            </div>
          </dl>
        </div>
      </section>

      {sports.length > 0 && (
        <section className="sports-feature" aria-labelledby="sports-feature-heading">
          <div className="container">
            <div className="sports-feature__head">
              <h2 id="sports-feature-heading" className="sports-feature__title">
                🏆 লাইভ খেলা · Live Sports
              </h2>
              <Link href="/#sports" className="sports-feature__all">
                সব খেলার চ্যানেল →
              </Link>
            </div>
            <p className="sports-feature__sub">
              ক্রিকেট, ফুটবলসহ সব স্পোর্টস চ্যানেল এক জায়গায় — {sports.length}টি লাইভ খেলার চ্যানেল।
            </p>
            <ul className="rail" role="list">
              {sports.map((c) => (
                <ChannelCard key={c.slug} channel={c} featured />
              ))}
            </ul>
          </div>
        </section>
      )}

      <Browse channels={channels} />

      <section className="container seo-copy" aria-labelledby="about-heading">
        <h2 id="about-heading">BDTV Live — বাংলাদেশের সব টিভি চ্যানেল এক জায়গায়</h2>
        <p>
          BDTV Live-এ আপনি {channels.length}টিরও বেশি লাইভ টিভি চ্যানেল ফ্রিতে দেখতে পারবেন।{" "}
          {activeCats.map((c) => `${categoryMeta[c].bn} (${c})`).join(", ")} — প্রতিটি ক্যাটাগরিতে
          সাজানো যাতে আপনি সহজেই আপনার পছন্দের চ্যানেলটি খুঁজে পান। বিশেষভাবে খেলার চ্যানেলগুলো উপরে
          আলাদা করে হাইলাইট করা হয়েছে। সব স্ট্রিম মোবাইল ও ডেস্কটপে কাজ করে।
        </p>
      </section>
    </>
  );
}
