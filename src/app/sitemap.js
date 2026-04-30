export default async function sitemap() {
  const baseUrl = 'https://cssuop.org';

  const staticRoutes = [
    '',
    '/about',
    '/events',
    '/gallery',
    '/blog',
    '/videos',
    '/alumni',
    '/contact',
    '/certificates',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
