
import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await db.dish.findUnique({ where: { id } });

  const dishName = dish ? dish.name : 'Traditional Dish';
  const dishPrice = dish ? `${dish.price} ${dish.currency || 'ETB'}` : '';
  const dishCategory = dish ? dish.category : 'Addis Eats';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#09090b',
          color: '#fafaf9',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Addis Eats
          </span>
          <span style={{ fontSize: '20px', backgroundColor: '#292524', padding: '8px 20px', borderRadius: '9999px', color: '#d6d3d1' }}>
            {dishCategory}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '64px', fontWeight: 'extrabold', lineHeight: '1.1' }}>
            {dishName}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>
            {dishPrice}
          </div>
        </div>

        <div style={{ fontSize: '20px', color: '#a8a29e', borderTop: '1px solid #292524', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Order fresh and authentic food online</span>
          <span>addiseats.et</span>
        </div>
      </div>
    ),
    { ...size }
  );
}