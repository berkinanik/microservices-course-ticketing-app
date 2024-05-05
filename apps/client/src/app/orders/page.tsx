import { headers } from 'next/headers';

import { type OrdersResponse } from '~/@types';
import { buildClientServer } from '~/http';

export default async function OrdersPage() {
  const client = buildClientServer(headers);
  const orders = await client.get<OrdersResponse>(`/api/orders`).then((res) => {
    if (res.ok) return res.data.orders;

    return [];
  });

  // TODO orders page
  return <></>;
}
