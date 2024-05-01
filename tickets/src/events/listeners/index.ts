import { Stan } from 'node-nats-streaming';
import { OrderCreatedListener } from './order-created-listener';
import { OrderCancelledListener } from './order-cancelled-listener';

export const startListeners = (client: Stan) => {
  new OrderCreatedListener(client).listen();
  new OrderCancelledListener(client).listen();
};
