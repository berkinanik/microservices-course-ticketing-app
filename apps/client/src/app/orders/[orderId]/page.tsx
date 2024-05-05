import { headers } from 'next/headers';
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
  return <></>;
}
