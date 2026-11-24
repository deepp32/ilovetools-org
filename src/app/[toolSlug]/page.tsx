import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolWorkspace from '@/components/ToolWorkspace';
import { STARTER_TOOLS, ToolConfig } from '@/config/tools';

interface PageProps {
  params: Promise<{ toolSlug: string }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return STARTER_TOOLS.map((tool) => ({
    toolSlug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = STARTER_TOOLS.find((t) => t.slug === toolSlug);

  if (!tool) {
    return {
      title: 'Tool Not Found — iLoveTools',
    };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: [
      tool.title,
      tool.slug.replace(/-/g, ' '),
      'free online converter',
      'compressor',
      '100% private',
      'no file upload',
      'no watermark',
      'client side tool',
    ],
    openGraph: {
      title: `${tool.metaTitle} | iLoveTools`,
      description: tool.metaDescription,
      url: `/${tool.slug}`,
      type: 'website',
      siteName: 'iLoveTools',
      images: [
        {
          url: '/producthunt_gallery.jpg',
          width: 1200,
          height: 630,
          alt: `${tool.title} — iLoveTools Free Online Utility`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.metaTitle} | iLoveTools`,
      description: tool.metaDescription,
      images: ['/producthunt_gallery.jpg'],
    },
    alternates: {
      canonical: `/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { toolSlug } = await params;
  const tool = STARTER_TOOLS.find((t) => t.slug === toolSlug);

  if (!tool) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ilovetools.org';

  // Find related tools by slugs
  const relatedTools: ToolConfig[] = (tool.relatedToolSlugs || [])
    .map((slug) => STARTER_TOOLS.find((t) => t.slug === slug))
    .filter((t): t is ToolConfig => Boolean(t));

  // JSON-LD Schema for Google & AI Engines (GEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.title,
        url: `${baseUrl}/${tool.slug}`,
        description: tool.metaDescription,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '1240',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.category.toUpperCase(),
            item: `${baseUrl}/#tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.title,
            item: `${baseUrl}/${tool.slug}`,
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: `How to use ${tool.title}`,
        description: `Step-by-step instructions for using ${tool.title} online for free with 100% privacy.`,
        step: tool.steps.map((step, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: step.title,
          text: step.description,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Schema.org for Google Rich Results & AI Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 w-full">
        <ToolWorkspace tool={tool} relatedTools={relatedTools} />
      </main>

      <Footer />
    </div>
  );
}
