import { OrderStatus, OrderUpdatedEvent } from '@b.anik/common';
import { OrderUpdatedListener } from '../order-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderDoc } from '../../../models';
import mongoose from 'mongoose';

describe('OrderUpdatedListener', () => {
  let data: OrderUpdatedEvent['data'];

  let listener: OrderUpdatedListener;

  beforeEach(async () => {
    listener = new OrderUpdatedListener(natsWrapper.client);

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
    });
    await order.save();

    data = {
      id: order.id,
      version: 1,
      status: OrderStatus.Cancelled,
    };
  });

  it('should update the order status and version', async () => {
    await listener.onMessage(data);

    const order = (await Order.findById(data.id)) as OrderDoc | null;

    expect(order).toBeDefined();
    expect(order!.status).toBe(data.status);
    expect(order!.version).toBe(data.version);
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
