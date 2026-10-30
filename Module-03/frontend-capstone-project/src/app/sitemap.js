
import { db } from '@/lib/db';

export default async function sitemap() {
  const baseUrl ='https://codeops-practice-f4qz.vercel.app'; 

  // 1. Fetch all dishes dynamically from the database
  const dishes = await db.dish.findMany();
  const dishEntries = dishes.map((dish) => ({
    url: `${baseUrl}/menu/${dish.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Define static routes (excluding private routes like /cart and /checkout)
  const staticRoutes = [
    '',
    '/menu',
    '/auth/login',
    '/auth/register',
  ].route; // or simple mapping below:

  const staticEntries = ['', '/menu', '/auth/login', '/auth/register'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticEntries, ...dishEntries];
}