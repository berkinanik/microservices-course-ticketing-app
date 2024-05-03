import { Listener, OrderCreatedEvent, Subjects } from '@b.anik/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const order = Order.build({
          id: data.id,
          version: data.version,
          price: data.ticket.price,
          userId: data.userId,
          status: data.status,
        });
        await order.save();

        // TODO - Emit an event to update the order status to OrderStatus.AwaitingPayment

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
