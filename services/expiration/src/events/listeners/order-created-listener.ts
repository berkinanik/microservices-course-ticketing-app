import { Listener, OrderCreatedEvent, Subjects } from '@b.anik/ticketing-common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = 'expiration-service';

  async onMessage(data: OrderCreatedEvent['data'], _msg?: Message): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data.expiresAt) {
          // if the order has no expiration date, we don't need to schedule an expiration
          return resolve();
        }

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        await expirationQueue.add(
          {
            orderId: data.id,
          },
          {
            delay,
          },
        );

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
