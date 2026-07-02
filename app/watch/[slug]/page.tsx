import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Player from "@/components/Player";
import ChannelCard from "@/components/ChannelCard";
import { channels, getChannel, relatedChannels } from "@/lib/channels";
import { categoryMeta, categorySlug } from "@/lib/categoryMeta";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return channels.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const channel = getChannel(slug);
  if (!channel) return { title: "Channel not found" };

  const title = `${channel.name} Live ${channel.bn ? "(" + channel.bn + ")" : ""} — Watch Free HD`.trim();
  const description = `${channel.desc} Watch ${channel.name} live streaming online free in ${channel.quality} on ${site.name} — no app, no signup.`;
  const url = `${site.url}/watch/${channel.slug}`;

  return {
    title,
    description,
    keywords: [
      `${channel.name} live`,
      `${channel.name} live streaming`,
      `watch ${channel.name} online`,
      `${channel.name} HD free`,
      channel.bn ? `${channel.bn} লাইভ` : `${channel.category} channel live`,
    ],
    alternates: { canonical: `/watch/${channel.slug}` },
    openGraph: {
      type: "video.other",
      url,
      title: `${channel.name} Live — ${site.name}`,
      description,
      images: channel.logo ? [{ url: channel.logo, alt: channel.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${channel.name} Live`,
      description,
    },
  };
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const channel = getChannel(slug);
  if (!channel) notFound();

  const related = relatedChannels(slug, 8);
  const cat = categoryMeta[channel.category];
  const isSport = channel.category === "Sports";
  const pageUrl = `${site.url}/watch/${channel.slug}`;
  const catUrl = `${site.url}/category/${categorySlug(channel.category)}`;

  const faq = [
    {
      q: `How can I watch ${channel.name} live for free?`,
      a: `Just press play above — ${channel.name} streams live in your browser on BDTV Live, free and in ${channel.quality}, with no app, no signup and no subscription.`,
    },
    {
      q: `Is ${channel.name} live streaming available on mobile?`,
      a: `Yes, ${channel.name} plays directly on mobile, tablet and desktop browsers. The stream is mobile friendly and needs no download.`,
    },
  ];

  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${channel.name} Live`,
    description: channel.desc,
    thumbnailUrl: channel.logo ? [channel.logo] : [`${site.url}/icon.svg`],
    uploadDate: "2026-06-30T00:00:00+06:00",
    genre: channel.category,
    inLanguage: "bn",
    isFamilyFriendly: true,
    embedUrl: pageUrl,
    url: pageUrl,
    isLiveBroadcast: true,
    publication: {
      "@type": "BroadcastEvent",
      name: `${channel.name} Live Stream`,
      isLiveBroadcast: true,
      videoFormat: channel.quality,
      startDate: "2026-06-30T00:00:00+06:00",
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: channel.category,
        item: catUrl,
      },
      { "@type": "ListItem", position: 3, name: channel.name, item: `${site.url}/watch/${channel.slug}` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="watch">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> &nbsp;›&nbsp;
          <Link href={`/category/${categorySlug(channel.category)}`}>{channel.category}</Link> &nbsp;›&nbsp;
          <span aria-current="page">{channel.name}</span>
        </nav>

        <article className={isSport ? "is-sport" : undefined}>
          {isSport && (
            <p className="sport-banner" role="note">
              🏆 লাইভ খেলা চলছে · Live Sports broadcast
            </p>
          )}

          <figure className="player-figure">
            <Player src={channel.stream} poster={channel.logo || undefined} title={channel.name} />
            <figcaption className="sr-only">{channel.name} live stream</figcaption>
          </figure>

          <header className="watch__head">
            {channel.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="watch__logo"
                src={channel.logo}
                alt={`${channel.name} logo`}
                referrerPolicy="no-referrer"
                width={58}
                height={58}
              />
            ) : (
              <span className="watch__logo--init" aria-hidden="true">
                {channel.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <h1 className="watch__title">{channel.name} Live</h1>
              <div className="watch__sub">
                {channel.bn && <span>{channel.bn}</span>}
                <span className="tag">
                  {cat.icon} {channel.category}
                </span>
                <span className="tag">{channel.quality}</span>
                <span className="tag tag--live">● LIVE</span>
              </div>
            </div>
          </header>

          <p className="watch__desc">{channel.desc}</p>
        </article>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="section-title">
            আরও দেখুন / More {channel.category} channels
          </h2>
          <ul className="grid" role="list">
            {related.map((c) => (
              <ChannelCard key={c.slug} channel={c} />
            ))}
          </ul>
        </section>

        <section className="seo-copy" aria-labelledby="about-channel-heading">
          <h2 id="about-channel-heading">Watch {channel.name} live online free</h2>
          <p>
            {channel.desc} On BDTV Live you can stream {channel.name} live in {channel.quality}{" "}
            straight from your browser — no app, no signup and no subscription. It works on mobile,
            tablet and desktop. Explore more{" "}
            <Link href={`/category/${categorySlug(channel.category)}`}>
              live {channel.category.toLowerCase()} channels
            </Link>{" "}
            or browse all channels on the{" "}
            <Link href="/">BDTV Live home page</Link>.
          </p>
          <h2 id="channel-faq-heading">Frequently asked questions</h2>
          <dl className="faq">
            {faq.map((f) => (
              <div key={f.q} className="faq__item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
