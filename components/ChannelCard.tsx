import Link from "next/link";
import type { Channel } from "@/lib/channels";

function initials(name: string): string {
  const words = name.replace(/\([^)]*\)/g, "").trim().split(/\s+/).filter(Boolean);
  const letters = (words[0]?.[0] || "") + (words[1]?.[0] || "");
  return (letters || name.slice(0, 2)).toUpperCase();
}

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      href={`/watch/${channel.slug}`}
      className="card"
      data-category={channel.category}
      aria-label={`${channel.name} লাইভ দেখুন`}
    >
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
      </div>
      <div className="card__body">
        <h3 className="card__title">{channel.name}</h3>
        {channel.bn ? <p className="card__bn">{channel.bn}</p> : <p className="card__bn">{channel.category}</p>}
        <div className="card__meta">
          <span className="badge">{channel.category}</span>
          <span className="card__quality">{channel.quality}</span>
        </div>
      </div>
    </Link>
  );
}
