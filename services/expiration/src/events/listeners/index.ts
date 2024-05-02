import { Stan } from 'node-nats-streaming';
import { OrderCreatedListener } from './order-created-listener';

export const startListeners = (client: Stan) => {
  new OrderCreatedListener(client).listen();
};
