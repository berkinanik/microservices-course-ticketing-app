import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CheckoutForm } from './CheckoutForm';

import { type OrderResponse } from '~/@types';
import { ExpirationTimer } from '~/components';
import { OrderStatus } from '~/constants';
import { buildClientServer } from '~/http';
import { getCurrentUser } from '~/services';

export default async function OrderPage({ params: { orderId } }: { params: { orderId: string } }) {
  const currentUser = await getCurrentUser(headers);
  const client = buildClientServer(headers);
  const order = await client.get<OrderResponse>(`/api/orders/${orderId}`).then((res) => {
    if (res.ok) return res.data.order;

    notFound();
  });

  const stripeKey = process.env.STRIPE_CLIENT_KEY ?? '';

  return (
    <div>
      <h1 className="mb-2 text-lg font-bold">
        Order <span className="italic">#{order.id}</span>
      </h1>
      <div className="flex flex-col gap-4">
        <div>
          <Link href={`/tickets/${order.ticket.id}`}>
            <p>Ticket ID: {order.ticket.id}</p>
          </Link>
          <p>Price: {order.ticket.price}</p>
          <p>Status: {order.status}</p>
        </div>

        {!!currentUser && order.status === OrderStatus.AwaitingPayment && (
          <>
            {order.expiresAt && <ExpirationTimer expiresAt={order.expiresAt} />}
            <CheckoutForm order={order} stripeKey={stripeKey} currentUser={currentUser} />
          </>
        )}
      </div>
    </div>
  );
}
