import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChannelCard from "@/components/ChannelCard";
import { channels, categories, type Category } from "@/lib/channels";
import { categoryMeta, categorySlug } from "@/lib/categoryMeta";
import { site } from "@/lib/site";

function catFromSlug(slug: string): Category | undefined {
  return categories.find((c) => categorySlug(c) === slug);
}

export function generateStaticParams() {
  return categories
    .filter((c) => channels.some((ch) => ch.category === c))
    .map((c) => ({ slug: categorySlug(c) }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = catFromSlug(slug);
  if (!cat) return { title: "Category not found" };
  const meta = categoryMeta[cat];
  const count = channels.filter((c) => c.category === cat).length;
  const title = `${meta.label} — ${count}+ ${cat} Channels Live Free HD`;
  const description = `${meta.intro} ${count}+ ${cat.toLowerCase()} channels, streaming live on ${site.name}.`;
  const url = `${site.url}/category/${slug}`;
  return {
    title,
    description,
    keywords: [meta.keyword, `${cat} channels live`, `live ${cat.toLowerCase()} tv`, meta.bn],
    alternates: { canonical: `/category/${slug}` },
    openGraph: { type: "website", url, title, description, siteName: site.name },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = catFromSlug(slug);
  if (!cat) notFound();
  const meta = categoryMeta[cat];
  const list = channels.filter((c) => c.category === cat);
  if (list.length === 0) notFound();
  const pageUrl = `${site.url}/category/${slug}`;

  const otherCats = categories.filter(
    (c) => c !== cat && channels.some((ch) => ch.category === c),
  );

  const graphLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: meta.label,
        description: meta.intro,
        isPartOf: { "@id": `${site.url}/#website` },
        inLanguage: ["bn", "en"],
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: list.length,
          itemListElement: list.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}/watch/${c.slug}`,
            name: `${c.name} Live`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: cat, item: pageUrl },
        ],
      },
      ...(meta.faq.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: meta.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphLd) }}
      />
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> &nbsp;›&nbsp;
          <span aria-current="page">{cat}</span>
        </nav>
      </div>

      <section className="hero" aria-labelledby="cat-heading">
        <div className="container">
          <h1 id="cat-heading">
            {meta.icon} {meta.label}{" "}
            <span className="hl">· {meta.bn}</span>
          </h1>
          <p>{meta.intro}</p>
        </div>
      </section>

      <div className="container">
        <section className="section" aria-labelledby="cat-list-heading">
          <div className="section__head">
            <h2 id="cat-list-heading" className="section__title">
              {meta.icon} All {cat} Channels
            </h2>
            <span className="section__count">{list.length} channels</span>
          </div>
          <ul className="grid" role="list">
            {list.map((c) => (
              <ChannelCard key={c.slug} channel={c} />
            ))}
          </ul>
        </section>

        {meta.faq.length > 0 && (
          <section className="seo-copy" aria-labelledby="cat-faq-heading">
            <h2 id="cat-faq-heading">Frequently asked questions</h2>
            <dl className="faq">
              {meta.faq.map((f) => (
                <div key={f.q} className="faq__item">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="seo-copy" aria-labelledby="cat-more-heading">
          <h2 id="cat-more-heading">Explore more live TV categories</h2>
          <p className="cat-links">
            {otherCats.map((c) => (
              <Link key={c} href={`/category/${categorySlug(c)}`} className="cat-link">
                {categoryMeta[c].icon} {categoryMeta[c].label}
              </Link>
            ))}
          </p>
        </section>
      </div>
    </div>
  );
}
