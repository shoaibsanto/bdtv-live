import type { Category } from "./channels";

export interface CategoryInfo {
  icon: string;
  bn: string;
  /** SEO H1 / title for the category landing page. */
  label: string;
  /** Primary keyword phrase the category page targets. */
  keyword: string;
  /** Keyword-rich intro paragraph for the landing page. */
  intro: string;
  /** FAQ entries → FAQPage JSON-LD + on-page content. */
  faq: { q: string; a: string }[];
}

export const categoryMeta: Record<Category, CategoryInfo> = {
  News: {
    icon: "📰",
    bn: "সংবাদ",
    label: "Live Bangla News Channels",
    keyword: "bangla news live",
    intro:
      "Watch live Bangla news channels online free in HD — 24/7 breaking news, headlines, talk shows and current affairs from Bangladesh and around the world. বাংলা সংবাদ লাইভ দেখুন যেকোনো ডিভাইসে, কোনো অ্যাপ ছাড়াই।",
    faq: [
      {
        q: "How can I watch Bangla news live for free?",
        a: "Just open any news channel on BDTV Live and it starts streaming instantly in your browser — no app, no signup and no subscription required.",
      },
      {
        q: "Which Bangladeshi news channels are available?",
        a: "Popular 24-hour news channels including Somoy TV, Jamuna TV, Channel 24, DBC News, News24, ATN News, Independent TV and more are available live.",
      },
    ],
  },
  Entertainment: {
    icon: "🎭",
    bn: "বিনোদন",
    label: "Live Bangla Entertainment Channels",
    keyword: "bangla entertainment channel live",
    intro:
      "Watch live Bangla entertainment channels online free in HD — natok, drama serials, reality shows, music and family programmes. বিনোদন চ্যানেল লাইভ দেখুন NTV, Channel i, Banglavision, Deepto TV সহ আরও অনেক।",
    faq: [
      {
        q: "Where can I watch Bangla natok and drama live?",
        a: "Entertainment channels like NTV, Channel i, Banglavision, Maasranga and Deepto TV broadcast live drama and natok — watch them free on BDTV Live.",
      },
    ],
  },
  General: {
    icon: "📺",
    bn: "সাধারণ",
    label: "Live General TV Channels",
    keyword: "live tv channels",
    intro:
      "Watch general live TV channels online free in HD on BDTV Live — a mix of news, shows and entertainment for everyone, streaming on any device with no app required.",
    faq: [],
  },
  Movies: {
    icon: "🎬",
    bn: "চলচ্চিত্র",
    label: "Live Movie Channels",
    keyword: "movie channel live",
    intro:
      "Watch live movie channels online free in HD — non-stop films, cinema and blockbusters. সিনেমা চ্যানেল লাইভ দেখুন যেকোনো সময়, কোনো সাইন-আপ ছাড়াই।",
    faq: [
      {
        q: "Can I watch movies live for free?",
        a: "Yes — every movie channel on BDTV Live streams free in HD directly in your browser, with no app or subscription needed.",
      },
    ],
  },
  Sports: {
    icon: "⚽",
    bn: "খেলা",
    label: "Live Sports Channels",
    keyword: "live sports channel",
    intro:
      "Watch live sports channels online free in HD — live cricket, football, matches, highlights and events. খেলা লাইভ দেখুন BDTV Live-এ, কোনো অ্যাপ বা সাবস্ক্রিপশন ছাড়াই।",
    faq: [
      {
        q: "How can I watch live cricket and football for free?",
        a: "Open any sports channel on BDTV Live to stream live cricket, football and other events in HD — free, in your browser, with no app required.",
      },
      {
        q: "Do the sports streams work on mobile?",
        a: "Yes, every stream is mobile friendly and plays directly in your phone or tablet browser without any download.",
      },
    ],
  },
  Music: {
    icon: "🎵",
    bn: "গান",
    label: "Live Music Channels",
    keyword: "music channel live",
    intro:
      "Watch live music channels online free in HD — non-stop songs, music videos and hit tracks. গানের চ্যানেল লাইভ দেখুন BDTV Live-এ।",
    faq: [],
  },
  Kids: {
    icon: "🧸",
    bn: "শিশু",
    label: "Live Kids & Cartoon Channels",
    keyword: "kids cartoon channel live",
    intro:
      "Watch live kids and cartoon channels online free in HD — fun, family-safe cartoons and children's programmes. কার্টুন চ্যানেল লাইভ দেখুন নিরাপদে।",
    faq: [
      {
        q: "Are the kids channels safe to watch?",
        a: "Yes — the kids category features family-friendly cartoon and children's channels that are safe to watch and stream free in HD.",
      },
    ],
  },
  Religious: {
    icon: "🕌",
    bn: "ধর্মীয়",
    label: "Live Islamic & Religious Channels",
    keyword: "islamic tv live",
    intro:
      "Watch live Islamic and religious channels online free in HD — Quran recitation, waz, lectures and spiritual programmes. ইসলামিক চ্যানেল লাইভ দেখুন BDTV Live-এ।",
    faq: [],
  },
  Lifestyle: {
    icon: "🌿",
    bn: "লাইফস্টাইল",
    label: "Live Lifestyle Channels",
    keyword: "lifestyle channel live",
    intro:
      "Watch live lifestyle channels online free in HD — cooking, food, health, travel and wellness programmes streaming on any device.",
    faq: [],
  },
  International: {
    icon: "🌍",
    bn: "আন্তর্জাতিক",
    label: "Live International TV Channels",
    keyword: "international tv channels live",
    intro:
      "Watch live international TV channels online free in HD — global news, Indian channels, entertainment and world TV, all streaming free with no app required.",
    faq: [
      {
        q: "Which international channels can I watch live?",
        a: "BDTV Live carries popular Indian and international channels covering news, movies and entertainment — all streaming free in HD.",
      },
    ],
  },
};

export function catAnchor(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** URL slug for a category landing page, e.g. "Sports" → "sports". */
export function categorySlug(cat: Category): string {
  return catAnchor(cat);
}
