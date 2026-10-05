import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to Addis Eats</h1>
      <p>Authentic Ethiopian cuisine delivered directly to your doorstep.</p>
      
      <Link href="/menu" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', borderRadius: '4px' }}>
        View Menu
      </Link>
    </main>
  );
}