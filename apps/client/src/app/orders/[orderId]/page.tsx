import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { type OrderResponse } from '~/@types';
import { buildClientServer } from '~/http';

export default async function OrderPage({ params: { orderId } }: { params: { orderId: string } }) {
  const client = buildClientServer(headers);
  const order = await client.get<OrderResponse>(`/api/orders/${orderId}`).then((res) => {
    if (res.ok) return res.data.order;

    notFound();
  });

  // TODO order page
  return (
    <div>
      <h1 className="mb-2 text-lg font-bold">
        Order <span className="italic">#{order.id}</span>
      </h1>
      <div>
        <Link href={`/tickets/${order.ticket.id}`}>
          <p>Ticket ID: {order.ticket.id}</p>
        </Link>
        <p>Price: {order.ticket.price}</p>
        <p>Status: {order.status}</p>
      </div>
    </div>
  );
}
