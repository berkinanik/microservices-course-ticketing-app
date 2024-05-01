import { OrderCancelledEvent } from '@b.anik/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket, TicketDoc } from '../../../models';
import mongoose from 'mongoose';

describe('OrderCancelledListener', () => {
  let listener: OrderCancelledListener;
  let data: OrderCancelledEvent['data'];
  let ticket: TicketDoc;

  beforeEach(async () => {
    listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    ticket = Ticket.build({
      price: 10,
      title: 'concert',
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    ticket.orderId = orderId;
    await ticket.save();

    data = {
      id: orderId,
      version: 0,
      ticket: {
        id: ticket.id,
      },
    };
  });

  it('should clear the orderId of the ticket', async () => {
    await listener.onMessage(data);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket.orderId).toEqual(undefined);
  });

  it('should reject if the ticket is not found', async () => {
    await expect(
      listener.onMessage({
        ...data,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
        },
      }),
    ).rejects.toThrow(/ticket not found/i);
  });

  it('should reject if the ticketId and orderId do not match', async () => {
    await expect(
      listener.onMessage({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: data.version,
        ticket: {
          id: ticket.id,
        },
      }),
    ).rejects.toThrow(/ticket not found/i);
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

  it('should publish a ticket updated event', async () => {
    await listener.onMessage(data);

    const spy = jest.spyOn(natsWrapper.client, 'publish');
    expect(spy).toHaveBeenCalledTimes(1);
    const eventName = spy.mock.calls[0][0];
    expect(eventName).toEqual('ticket:updated');
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);
    expect(eventData).toEqual(
      expect.objectContaining({
        id: ticket.id,
        version: 2,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      }),
    );
  });
});
