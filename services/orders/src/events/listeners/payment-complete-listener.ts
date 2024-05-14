import { Listener, OrderStatus, PaymentCompleteEvent, Subjects } from '@b.anik/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderDoc } from '../../models';
import { OrderUpdatedPublisher } from '../publishers';

export class PaymentCompleteListener extends Listener<PaymentCompleteEvent> {
  readonly subject = Subjects.PaymentComplete;
  readonly queueGroupName = queueGroupName;
  async onMessage(data: PaymentCompleteEvent['data']): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { orderId } = data;

        const order = (await Order.findById(orderId)) as OrderDoc | null;

        if (!order) {
          throw new Error('Order not found');
        }

        order.status = OrderStatus.Complete;
        await order.save();

        await new OrderUpdatedPublisher(this.client).publish({
          id: order.id,
          status: order.status,
          version: order.version,
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
