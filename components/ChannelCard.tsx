import Link from "next/link";
import type { Channel } from "@/lib/channels";

function initials(name: string): string {
  const words = name.replace(/\([^)]*\)/g, "").trim().split(/\s+/).filter(Boolean);
  const letters = (words[0]?.[0] || "") + (words[1]?.[0] || "");
  return (letters || name.slice(0, 2)).toUpperCase();
}

export default function ChannelCard({
  channel,
  featured = false,
}: {
  channel: Channel;
  featured?: boolean;
}) {
  const isSport = featured || channel.category === "Sports";
  return (
    <li className="cell">
      <article className={`card ${isSport ? "card--sport" : ""}`} itemScope itemType="https://schema.org/VideoObject">
        <meta itemProp="name" content={`${channel.name} Live`} />
        <meta itemProp="genre" content={channel.category} />
        <meta itemProp="isLiveBroadcast" content="true" />
        {channel.logo && <meta itemProp="thumbnailUrl" content={channel.logo} />}
        <Link href={`/watch/${channel.slug}`} className="card__link" aria-label={`${channel.name} লাইভ দেখুন`}>
          <div className="card__thumb">
            {channel.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={channel.logo}
                alt={`${channel.name} logo`}
                loading="lazy"
                referrerPolicy="no-referrer"
                width={120}
                height={120}
              />
            ) : (
              <span className="card__initials" aria-hidden="true">
                {initials(channel.name)}
              </span>
            )}
            <span className="card__live">
              <span className="card__dot" />
              LIVE
            </span>
            {isSport && <span className="card__sportbadge">🏆 SPORTS</span>}
          </div>
          <div className="card__body">
            <h3 className="card__title" itemProp="alternateName">
              {channel.name}
            </h3>
            <p className="card__bn">{channel.bn || channel.category}</p>
            <div className="card__meta">
              <span className="badge">{channel.category}</span>
              <span className="card__quality">{channel.quality}</span>
            </div>
          </div>
        </Link>
      </article>
    </li>
  );
}
