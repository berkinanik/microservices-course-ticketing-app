import mongoose from 'mongoose';
import { Ticket } from '../ticket';

describe('ticket model', () => {
  it('should implement optimistic concurrency control', async () => {
    const ticket = await Ticket.build({
      title: 'concert',
      price: 5,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

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
      title: 'concert',
      price: 20,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();
    expect(ticket.version).toBe(0);

    await ticket.save();
    expect(ticket.version).toBe(1);

    await ticket.save();
    expect(ticket.version).toBe(2);
  });
});
