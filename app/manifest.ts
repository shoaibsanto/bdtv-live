import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name + " — Bangladeshi Live TV",
    short_name: site.shortName,
    description: site.descriptionEn,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fc",
    theme_color: "#0a7d5a",
    lang: "bn",
    categories: ["entertainment", "news", "video"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
