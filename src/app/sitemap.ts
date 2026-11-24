import { MetadataRoute } from 'next';
import { STARTER_TOOLS } from '@/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ilovetools.org';
  const stableReleaseDate = new Date('2026-11-20T00:00:00.000Z');
  const recentUpdateDate = new Date('2026-11-24T00:00:00.000Z');

  // Priority flagship tools being indexed & boosted from live search queries
  const prioritySlugs = new Set([
    'crop-video',
    'compress-video',
    'word-to-pdf',
    'video-to-mp3',
    'video-to-gif',
    'compress-image',
    'merge-pdf',
    'password-generator',
    'pdf-to-excel',
    'image-to-pdf',
  ]);

  const toolUrls = STARTER_TOOLS.map((tool) => {
    const isPriority = prioritySlugs.has(tool.slug);
    return {
      url: `${baseUrl}/${tool.slug}`,
      lastModified: isPriority ? recentUpdateDate : stableReleaseDate,
      changeFrequency: (isPriority ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: isPriority ? 1.0 : 0.9,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: recentUpdateDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...toolUrls,
    {
      url: `${baseUrl}/privacy`,
      lastModified: stableReleaseDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: stableReleaseDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];
}
