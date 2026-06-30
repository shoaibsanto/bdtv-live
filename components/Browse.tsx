"use client";

import { useMemo, useState } from "react";
import { categories, type Channel } from "@/lib/channels";
import { categoryMeta, catAnchor } from "@/lib/categoryMeta";
import ChannelCard from "./ChannelCard";

export default function Browse({ channels }: { channels: Channel[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const ch of channels) c[ch.category] = (c[ch.category] || 0) + 1;
    return c;
  }, [channels]);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const filtered = useMemo(() => {
    if (!searching) return channels;
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.bn.includes(query.trim()) ||
        c.category.toLowerCase().includes(q),
    );
  }, [channels, q, query, searching]);

  const visibleCats = categories.filter((cat) => active === "All" || active === cat);

  return (
    <>
      <div className="toolbar">
        <div className="container">
          <label htmlFor="channel-search" className="sr-only">
            Search channels
          </label>
          <input
            id="channel-search"
            type="search"
            className="search"
            placeholder="চ্যানেল খুঁজুন… Search 200+ channels (NTV, Somoy, Sports…)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <nav className="filters" aria-label="Channel categories">
            <button
              type="button"
              aria-pressed={active === "All"}
              className={`chip ${active === "All" ? "chip--active" : ""}`}
              onClick={() => {
                setActive("All");
                setQuery("");
              }}
            >
              ✨ All<span className="chip__count">{channels.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={active === cat}
                className={`chip ${cat === "Sports" ? "chip--sport" : ""} ${active === cat ? "chip--active" : ""}`}
                onClick={() => {
                  setActive(cat);
                  setQuery("");
                }}
              >
                {categoryMeta[cat].icon} {cat}
                <span className="chip__count">{counts[cat] || 0}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container">
        {searching ? (
          filtered.length === 0 ? (
            <p className="empty">“{query}” — কোনো চ্যানেল পাওয়া যায়নি। (No channels found.)</p>
          ) : (
            <section className="section" aria-labelledby="results-heading">
              <div className="section__head">
                <h2 id="results-heading" className="section__title">
                  🔎 ফলাফল / Results
                </h2>
                <span className="section__count">{filtered.length} channels</span>
              </div>
              <ul className="grid" role="list">
                {filtered.map((c) => (
                  <ChannelCard key={c.slug} channel={c} />
                ))}
              </ul>
            </section>
          )
        ) : (
          visibleCats.map((cat) => {
            const list = channels.filter((c) => c.category === cat);
            if (list.length === 0) return null;
            const isSport = cat === "Sports";
            return (
              <section
                key={cat}
                id={catAnchor(cat)}
                className={`section ${isSport ? "section--sport" : ""}`}
                aria-labelledby={`${catAnchor(cat)}-heading`}
              >
                <div className="section__head">
                  <h2 id={`${catAnchor(cat)}-heading`} className="section__title">
                    <span className="ic">{categoryMeta[cat].icon}</span>
                    {cat}{" "}
                    <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                      · {categoryMeta[cat].bn}
                    </span>
                  </h2>
                  <span className="section__count">{list.length} channels</span>
                </div>
                <ul className="grid" role="list">
                  {list.map((c) => (
                    <ChannelCard key={c.slug} channel={c} />
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
