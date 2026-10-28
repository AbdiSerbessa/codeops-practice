// src/app/api/orders/[id]/stream/route.js
import { getOrder, db } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let step = 0;

      const interval = setInterval(async () => {
        try {
          const order = (await getOrder(id)) || (await db.order.findUnique({ id }));

          let status = order?.status || 'PENDING';
          const origin = [8.9806, 38.7578];       // Restaurant location
          const destination = [8.9950, 38.7800];  // Delivery location

          let courierLocation = order?.courierLocation || origin;

          // Automatically animate movement when OUT FOR DELIVERY
          if (status === 'OUT FOR DELIVERY') {
            step++;
            const maxSteps = 15; // Number of ticks to reach destination

            if (step >= maxSteps) {
              status = 'DELIVERED';
              courierLocation = destination;
              
              // Automatically persist status update in memory store
              if (order) {
                order.status = 'DELIVERED';
                order.courierLocation = courierLocation;
                order.updatedAt = new Date().toISOString();
              }
            } else {
              const progress = step / maxSteps;
              const lat = origin[0] + (destination[0] - origin[0]) * progress;
              const lng = origin[1] + (destination[1] - origin[1]) * progress;
              courierLocation = [lat, lng];
              
              if (order) order.courierLocation = courierLocation;
            }
          } else if (status === 'DELIVERED') {
            courierLocation = destination;
          }

          const timestamp = order?.updatedAt || order?.createdAt || new Date().toISOString();
          const payload = `data: ${JSON.stringify({ status, courierLocation, timestamp })}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (err) {
          console.error('[SSE Stream Error]:', err);
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