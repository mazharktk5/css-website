export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/private',
          '/*.json$',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      }
    ],
    sitemap: 'https://cssuop.org/sitemap.xml',
  }
}
