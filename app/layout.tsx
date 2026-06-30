import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { channels } from "@/lib/channels";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  category: "entertainment",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.descriptionEn,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a7d5a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.descriptionEn,
    inLanguage: ["bn", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    about: `${channels.length} live TV channels`,
  };

  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://owrcovcrpy.gpcdn.net" />
        <link rel="dns-prefetch" href="https://i.imgur.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container site-header__inner">
            <Link href="/" className="logo" aria-label={`${site.name} home`}>
              <span className="logo__mark">▶</span>
              <span>
                BDTV <span className="logo__live">Live</span>
              </span>
            </Link>
            <nav className="nav" aria-label="Primary">
              <Link href="/#news">News</Link>
              <Link href="/#entertainment">Entertainment</Link>
              <Link href="/#sports">Sports</Link>
              <Link href="/#movies">Movies</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p className="disclaimer">
            BDTV Live শুধুমাত্র পাবলিকভাবে উপলব্ধ লাইভ স্ট্রিম একত্রিত করে দেখায়। আমরা কোনো
            কন্টেন্ট হোস্ট, স্টোর বা ব্রডকাস্ট করি না; সমস্ত স্বত্ব সংশ্লিষ্ট ব্রডকাস্টারের।
            BDTV Live only links to publicly available live streams. We do not host, store or
            broadcast any content; all rights belong to their respective broadcasters.
          </p>
          <div className="container site-footer__inner">
            <span>© {2026} {site.name}</span>
            <span>Made for Bangladesh 🇧🇩 · {channels.length} channels</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
