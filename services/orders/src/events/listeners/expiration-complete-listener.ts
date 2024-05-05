import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@b.anik/common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderDoc } from '../../models';
import { OrderCancelledPublisher } from '../publishers';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], _msg?: Message): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const order = (await Order.findById(data.orderId).populate('ticket')) as OrderDoc | null;

        if (!order) {
          throw new Error('Order not found');
        }

        if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Complete) {
          // If the order is already cancelled or completed, we don't need to do anything
          return resolve();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
          id: order.id,
          version: order.version,
          ticket: {
            id: order.ticket.id,
          },
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
