

export async function GET(request, { params }) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let step = 0;
      const statuses = ['Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

      // Send initial data immediately
      const initialData = JSON.stringify({
        orderId: id,
        status: statuses[0],
        timestamp: new Date().toISOString(),
        courierLocation: [8.9806, 38.7578],
      });
      controller.enqueue(encoder.encode(`data: ${initialData}\n\n`));
      step++;

      const interval = setInterval(() => {
        if (step < statuses.length) {
          const data = JSON.stringify({
            orderId: id,
            status: statuses[step],
            timestamp: new Date().toISOString(),
            courierLocation: [8.9806 + step * 0.005, 38.7578 + step * 0.005],
          });

          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          step++;
        } else {
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

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