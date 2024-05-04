import { Stan } from 'node-nats-streaming';
import { OrderCreatedListener } from './order-created-listener';
import { OrderCancelledListener } from './order-cancelled-listener';
import { OrderUpdatedListener } from './order-updated-listener';

export const startListeners = (client: Stan) => {
  new OrderCreatedListener(client).listen();
  new OrderCancelledListener(client).listen();
  new OrderUpdatedListener(client).listen();
};
