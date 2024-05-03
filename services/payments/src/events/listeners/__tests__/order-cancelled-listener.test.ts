import { OrderCancelledEvent, OrderStatus } from '@b.anik/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order, OrderDoc } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';

describe('OrderCancelledListener', () => {
  let listener: OrderCancelledListener;
  let data: OrderCancelledEvent['data'];
  let order: OrderDoc;

  beforeEach(async () => {
    listener = new OrderCancelledListener(natsWrapper.client);

    order = await Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 10,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await order.save();

    data = {
      id: order.id,
      version: 1,
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString(),
      },
    };
  });

  it('should reject if the order is not found', async () => {
    await expect(
      listener.onMessage({
        ...data,
        id: new mongoose.Types.ObjectId().toHexString(),
      }),
    ).rejects.toThrow(/order not found/i);

    await expect(
      listener.onMessage({
        ...data,
        version: 2,
      }),
    ).rejects.toThrow(/order not found/i);
  });

  it('should update the status of the order to cancelled', async () => {
    await listener.onMessage(data);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('should set the version of the order to the received version', async () => {
    await listener.onMessage(data);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.version).toEqual(data.version);
  });

  it('should resolve a promise', async () => {
    await expect(listener.onMessage(data)).resolves.toBeUndefined();
  });
});
