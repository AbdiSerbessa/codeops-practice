export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout'],
    },
    sitemap: 'https://codeops-practice-f4qz.vercel.app/sitemap.xml',
  };
}