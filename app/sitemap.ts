import type { MetadataRoute } from "next";
import { channels, categories } from "@/lib/channels";
import { categorySlug } from "@/lib/categoryMeta";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  const cats: MetadataRoute.Sitemap = categories
    .filter((c) => channels.some((ch) => ch.category === c))
    .map((c) => ({
      url: `${site.url}/category/${categorySlug(c)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    }));

  const watch: MetadataRoute.Sitemap = channels.map((c) => ({
    url: `${site.url}/watch/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...home, ...cats, ...watch];
}
