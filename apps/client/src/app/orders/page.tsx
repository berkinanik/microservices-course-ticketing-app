import { headers } from 'next/headers';
import Link from 'next/link';

import { type OrdersResponse } from '~/@types';
import { Button, ExpirationTimer } from '~/components';
import { OrderStatus } from '~/constants';
import { buildClientServer } from '~/http';

export default async function OrdersPage() {
  const client = buildClientServer(headers);
  const orders = await client.get<OrdersResponse>(`/api/orders`).then((res) => {
    if (res.ok) return res.data.orders.toReversed();

    return [];
  });

  return (
    <div>
      <h1 className="mb-2 text-lg font-bold">Orders</h1>
      <div className="flex flex-col items-stretch gap-2">
        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-row flex-wrap items-end justify-between gap-4 rounded-md border p-4"
            >
              <div>
                <p className="font-semibold">Order ID: {order.id}</p>
                <Link href={`/tickets/${order.ticket.id}`}>
                  <p>Ticket ID: {order.ticket.id}</p>
                </Link>
                <p>Price: ${order.ticket.price}</p>
                <p>Status: {order.status}</p>
              </div>

              {order.status === OrderStatus.AwaitingPayment && (
                <div className="flex flex-col items-end justify-end gap-2">
                  {order.expiresAt && <ExpirationTimer expiresAt={order.expiresAt} />}

                  <Link href={`/orders/${order.id}`}>
                    <Button>Pay now</Button>
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <>
            <p>No orders found.</p>
            <div>
              <Link href="/">
                <Button>Find some tickets</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
