import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://luxespace.com';

  const staticPages = [
    '',
    '/explore',
    '/blog',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/cookies',
    '/privacy',
    '/terms',
  ];

  const staticUrls = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [
    ...staticUrls,
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];
}