import { headers } from 'next/headers';
import Link from 'next/link';

import { type TicketsResponse } from '~/@types';
import { Button, TicketCard } from '~/components';
import { buildClientServer } from '~/http';

export default async function Home() {
  const client = buildClientServer(headers);
  const tickets = await client
    .get<TicketsResponse>('/api/tickets')
    .then((res) => res.data?.tickets ?? []);

  return (
    <div>
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1 className="text-lg font-bold">Tickets</h1>

        <Link href="/tickets/new">
          <Button>Create ticket</Button>
        </Link>
      </div>

      <ul className="flex flex-row flex-wrap justify-start gap-4">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="rounded-md border p-4">
            <TicketCard ticket={ticket} />
          </li>
        ))}
      </ul>
    </div>
  );
}
