export default async function sitemap() {
  const baseUrl = 'https://cssuop.org';

  const staticRoutes = [
    '',
    '/about',
    '/events',
    '/gallery',
    '/blog',
    '/alumni',
    '/contact',
    '/certificates',
    '/techrise',
    '/techrise/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : route === '/techrise' ? 0.9 : 0.8,
  }));

  return [...staticRoutes];
}
