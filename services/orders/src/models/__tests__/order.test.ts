import mongoose from 'mongoose';
import { Order, OrderStatus } from '../order';
import { Ticket } from '../ticket';

describe('order model', () => {
  it('should implement optimistic concurrency control', async () => {
    const ticket = await Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 5,
      version: 0,
    });
    await ticket.save();

    const order = await Order.build({
      ticket,
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: new Date(),
    });
    await order.save();

    const firstInstance = await Order.findById(order.id);
    const secondInstance = await Order.findById(order.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();
    const trySecondInstanceSave = async () => {
      await secondInstance!.save();
    };

    await expect(trySecondInstanceSave).rejects.toThrow(/version 0/i);
  });

  it('should increment the version number on multiple saves', async () => {
    const ticket = await Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 5,
      version: 0,
    });
    await ticket.save();

    const order = await Order.build({
      ticket,
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: new Date(),
    });

    await order.save();
    expect(order.version).toBe(0);

    await order.save();
    expect(order.version).toBe(1);

    await order.save();
    expect(order.version).toBe(2);
  });
});
