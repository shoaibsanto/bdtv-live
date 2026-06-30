import type { MetadataRoute } from "next";
import { channels } from "@/lib/channels";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = [
    {
      url: site.url,
      changeFrequency: "hourly",
      priority: 1,
    },
  ];
  const watch: MetadataRoute.Sitemap = channels.map((c) => ({
    url: `${site.url}/watch/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));
  return [...home, ...watch];
}
