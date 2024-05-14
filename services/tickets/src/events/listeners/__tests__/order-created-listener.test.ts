import { OrderCreatedEvent, OrderStatus } from '@b.anik/ticketing-common';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket, TicketDoc } from '../../../models';

describe('OrderCreatedListener', () => {
  let listener: OrderCreatedListener;
  let data: OrderCreatedEvent['data'];
  let ticket: TicketDoc;

  beforeEach(async () => {
    listener = new OrderCreatedListener(natsWrapper.client);

    ticket = Ticket.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
      title: 'concert',
    });
    await ticket.save();

    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: new Date().toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };
  });

  it('should set the orderId of the ticket', async () => {
    await listener.onMessage(data);

    const updatedTicket = (await Ticket.findById(ticket.id)) as TicketDoc;

    expect(updatedTicket.orderId).toEqual(data.id);
  });

  it('should reject if the ticket is not found', async () => {
    await expect(
      listener.onMessage({
        ...data,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
          price: 10,
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
        version: 1,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId: data.id,
      }),
    );
  });
});
