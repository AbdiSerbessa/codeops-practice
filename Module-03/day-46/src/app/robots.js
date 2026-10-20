
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout'], // Exclude private user routes as specified
    },
    sitemap: 'http://localhost:3000/sitemap.xml',
  };
}