import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '4rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>404 - Page Not Found</h2>
      <p>Could not find the requested Addis Eats resource.</p>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        Return Home
      </Link>
    </main>
  );
}