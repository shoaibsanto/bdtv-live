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

  const videoLd = {
    "@context": "https://schema.org",
    "@type": "BroadcastEvent",
    name: `${channel.name} Live`,
    description: channel.desc,
    isLiveBroadcast: true,
    videoFormat: channel.quality,
    broadcastOfEvent: {
      "@type": "Event",
      name: `${channel.name} Live Stream`,
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
          <span>{channel.name}</span>
        </nav>

        <Player src={channel.stream} poster={channel.logo || undefined} title={channel.name} />

        <div className="watch__head">
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
            <span className="watch__logo--init">{channel.name.slice(0, 2).toUpperCase()}</span>
          )}
          <div>
            <h1 className="watch__title">{channel.name} Live</h1>
            <div className="watch__sub">
              {channel.bn && <span>{channel.bn}</span>}
              <span className="tag">
                {cat.icon} {channel.category}
              </span>
              <span className="tag">{channel.quality}</span>
              <span className="tag" style={{ color: "var(--accent)" }}>
                ● LIVE
              </span>
            </div>
          </div>
        </div>

        <p className="watch__desc">{channel.desc}</p>

        <h2 className="section-title">আরও দেখুন / More {channel.category} channels</h2>
        <div className="grid">
          {related.map((c) => (
            <ChannelCard key={c.slug} channel={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
