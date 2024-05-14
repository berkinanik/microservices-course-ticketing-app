import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@b.anik/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const order = await Order.findByEvent(data);

        if (!order) {
          throw new Error('Order not found');
        }

        order.set({
          status: OrderStatus.Cancelled,
          version: data.version,
        });
        await order.save();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
