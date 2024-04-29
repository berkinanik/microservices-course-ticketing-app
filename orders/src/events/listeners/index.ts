import { Stan } from 'node-nats-streaming';
import { TicketCreatedListener } from './ticket-created-listener';
import { TicketUpdatedListener } from './ticket-updated-listener';

export const startListeners = (client: Stan) => {
  new TicketCreatedListener(client).listen();
  new TicketUpdatedListener(client).listen();
};
