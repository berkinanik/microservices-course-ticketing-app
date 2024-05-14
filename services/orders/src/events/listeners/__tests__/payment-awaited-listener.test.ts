import { OrderStatus, PaymentAwaitedEvent } from '@b.anik/ticketing-common';
import { PaymentAwaitedListener } from '../payment-awaited-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderDoc, Ticket } from '../../../models';
import mongoose from 'mongoose';

describe('PaymentAwaitedListener', () => {
  let data: PaymentAwaitedEvent['data'];

  let listener: PaymentAwaitedListener;

  beforeEach(async () => {
    listener = new PaymentAwaitedListener(natsWrapper.client);

    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      title: 'concert',
      version: 0,
    });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await order.save();

    data = {
      orderId: order.id,
    };
  });

  it('should update the order status to AwaitingPayment', async () => {
    await listener.onMessage(data);

    const order = (await Order.findById(data.orderId)) as OrderDoc;

    expect(order).toBeDefined();
    expect(order.status).toBe(OrderStatus.AwaitingPayment);
  });

  it('should publish an OrderUpdated event', async () => {
    const spy = jest.spyOn(natsWrapper.client, 'publish');

    await listener.onMessage(data);

    expect(spy).toHaveBeenCalled();
    const eventName = spy.mock.calls[0][0];
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);
    expect(eventName).toBe('order:updated');
    expect(eventData).toEqual({
      id: data.orderId,
      status: OrderStatus.AwaitingPayment,
      version: 1,
    });
  });

  it('should resolve a promise', async () => {
    await listener
      .onMessage(data)
      .then(() => {
        expect(true).toBeTruthy();
      })
      .catch(() => {
        expect(false).toBeTruthy();
      });
  });
});
