import { Listener, OrderUpdatedEvent, Subjects } from '@b.anik/common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderDoc } from '../../models';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
  readonly queueGroupName = queueGroupName;
  async onMessage(data: OrderUpdatedEvent['data']): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { id, status, version } = data;

        const order = (await Order.findByEvent({
          id,
          version,
        })) as OrderDoc | null;

        if (!order) {
          throw new Error('Order not found');
        }

        order.set({
          version,
          status,
        });
        await order.save();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
