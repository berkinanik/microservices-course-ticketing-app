import { OrderStatus, PaymentCompleteEvent } from '@b.anik/common';
import { PaymentCompleteListener } from '../payment-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Order, OrderDoc, Ticket } from '../../../models';

describe('PaymentCompleteListener', () => {
  let listener: PaymentCompleteListener;
  let data: PaymentCompleteEvent['data'];

  beforeEach(async () => {
    listener = new PaymentCompleteListener(natsWrapper.client);

    const ticket = await Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
      version: 0,
    }).save();

    const order = await Order.build({
      ticket,
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.AwaitingPayment,
    }).save();

    data = {
      orderId: order.id,
    };
  });

  it('should update the order status to Complete', async () => {
    await listener.onMessage(data);

    const order = (await Order.findById(data.orderId)) as OrderDoc | null;

    expect(order).toBeDefined();
    expect(order!.status).toBe(OrderStatus.Complete);
    expect(order!.version).toBe(1);
  });

  it('should publish an OrderUpdated event', async () => {
    const spy = jest.spyOn(natsWrapper.client, 'publish');

    await listener.onMessage(data);

    expect(spy).toHaveBeenCalled();
    const eventName = spy.mock.calls[0][0];
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);

    expect(eventName).toBe('order:updated');
    expect(eventData.id).toBe(data.orderId);
    expect(eventData.status).toBe(OrderStatus.Complete);
    expect(eventData.version).toBe(1);
  });

  it('should resolve a promise', async () => {
    await expect(listener.onMessage(data)).resolves.toBeUndefined();
  });
});
