import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Player from "@/components/Player";
import ChannelCard from "@/components/ChannelCard";
import { channels, getChannel, relatedChannels } from "@/lib/channels";
import { categoryMeta, catAnchor } from "@/lib/categoryMeta";
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

  const title = `${channel.name} Live ${channel.bn ? "(" + channel.bn + ")" : ""}`.trim();
  const description = `${channel.name} লাইভ দেখুন — ${channel.desc} Watch ${channel.name} live online free in ${channel.quality} on ${site.name}.`;
  const url = `${site.url}/watch/${channel.slug}`;

  return {
    title,
    description,
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
        item: `${site.url}/#${catAnchor(channel.category)}`,
      },
      { "@type": "ListItem", position: 3, name: channel.name, item: `${site.url}/watch/${channel.slug}` },
    ],
  };

  return (
    <div className="watch">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> &nbsp;›&nbsp;
          <Link href={`/#${catAnchor(channel.category)}`}>{channel.category}</Link> &nbsp;›&nbsp;
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
      </div>
    </div>
  );
}
