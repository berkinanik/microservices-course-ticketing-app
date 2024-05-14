import { Listener, OrderStatus, PaymentAwaitedEvent, Subjects } from '@b.anik/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderDoc } from '../../models';
import { OrderUpdatedPublisher } from '../publishers';

export class PaymentAwaitedListener extends Listener<PaymentAwaitedEvent> {
  readonly subject = Subjects.PaymentAwaited;
  readonly queueGroupName = queueGroupName;
  async onMessage(data: PaymentAwaitedEvent['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const order = (await Order.findById(data.orderId).populate('ticket')) as OrderDoc | null;

        if (!order) {
          throw new Error('Order not found');
        }

        order.status = OrderStatus.AwaitingPayment;
        await order.save();

        await new OrderUpdatedPublisher(this.client).publish({
          id: order.id,
          version: order.version,
          status: order.status,
        });

        resolve();
      } catch (error) {
        reject;
      }
    });
  }
}
