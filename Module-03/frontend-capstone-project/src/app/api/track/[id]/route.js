import { db } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Poll database state every 2 seconds and stream updates to client
      const interval = setInterval(async () => {
        const order = await db.order.findUnique({ id });

        if (order) {
          const payload = `data: ${JSON.stringify({
            status: order.status,
            lat: order.lat || 8.9806,  // Default Addis Ababa coordinates
            lng: order.lng || 38.7578,
            updatedAt: new Date().toISOString(),
          })}\n\n`;

          controller.enqueue(encoder.encode(payload));
        }
      }, 2000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}