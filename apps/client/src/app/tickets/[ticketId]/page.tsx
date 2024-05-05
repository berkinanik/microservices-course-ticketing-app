import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { OrderInfo } from './OrderInfo';
import { PurchaseButton } from './PurchaseButton';

import { type Order, type OrderResponse, type TicketResponse } from '~/@types';
import { buildClientServer } from '~/http';

export default async function TicketPage({
  params: { ticketId },
}: {
  params: { ticketId: string };
}) {
  const client = buildClientServer(headers);

  let order: Order | null = null;

  const ticket = await client.get<TicketResponse>(`/api/tickets/${ticketId}`).then(async (res) => {
    if (res.ok) {
      const ticket = res.data.ticket;

      if (!!ticket.orderId) {
        order = await client
          .get<OrderResponse>(`/api/orders/${ticket.orderId}`)
          .then((res) => (res.ok ? res.data.order : null));
      }

      return ticket;
    }

    notFound();
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className="text-lg font-bold">{ticket.title}</h1>

        <PurchaseButton ticketId={ticket.id} disabled={!!ticket.orderId} />
      </div>

      {!order ? <p>Reserve your seat now only for ${ticket.price}</p> : <p>${ticket.price}</p>}

      {!!order && <OrderInfo order={order} />}
    </div>
  );
}
