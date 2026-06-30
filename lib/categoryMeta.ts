import type { Category } from "./channels";

export const categoryMeta: Record<Category, { icon: string; bn: string }> = {
  News: { icon: "📰", bn: "সংবাদ" },
  Entertainment: { icon: "🎭", bn: "বিনোদন" },
  General: { icon: "📺", bn: "সাধারণ" },
  Movies: { icon: "🎬", bn: "চলচ্চিত্র" },
  Sports: { icon: "⚽", bn: "খেলা" },
  Music: { icon: "🎵", bn: "গান" },
  Kids: { icon: "🧸", bn: "শিশু" },
  Religious: { icon: "🕌", bn: "ধর্মীয়" },
  Lifestyle: { icon: "🌿", bn: "লাইফস্টাইল" },
  International: { icon: "🌍", bn: "আন্তর্জাতিক" },
};

export function catAnchor(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
