import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#09090b',
          color: '#fafaf9',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '16px' }}>
          Addis Eats
        </div>
        <div style={{ fontSize: '64px', fontWeight: 'extrabold', textAlign: 'center', marginBottom: '20px' }}>
          Authentic Ethiopian Cuisine
        </div>
        <div style={{ fontSize: '24px', color: '#a8a29e', textAlign: 'center' }}>
          Fast traditional food ordering delivered hot to your doorstep.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}