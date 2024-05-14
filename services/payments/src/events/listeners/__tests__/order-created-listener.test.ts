import { OrderCreatedEvent, OrderStatus } from '@b.anik/ticketing-common';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderDoc } from '../../../models';

describe('OrderCreatedListener', () => {
  let listener: OrderCreatedListener;
  let data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };

  beforeEach(async () => {
    listener = new OrderCreatedListener(natsWrapper.client);
  });

  it('should create an order', async () => {
    await listener.onMessage(data);

    const order = (await Order.findById(data.id)) as OrderDoc | null;
    expect(order).toBeDefined();
    expect(order).toEqual(
      expect.objectContaining({
        version: data.version,
        price: data.ticket.price,
        userId: data.userId,
        status: data.status,
      }),
    );
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

  it('should publish a PaymentAwaited event', async () => {
    const spy = jest.spyOn(natsWrapper.client, 'publish');

    await listener.onMessage(data);

    expect(spy).toHaveBeenCalled();
    const eventName = spy.mock.calls[0][0];
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);
    expect(eventName).toBe('payment:awaited');
    expect(eventData).toEqual({ orderId: data.id });
  });
});
