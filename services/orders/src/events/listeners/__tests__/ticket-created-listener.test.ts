import { TicketCreatedEvent } from '@b.anik/ticketing-common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Ticket, TicketDoc } from '../../../models';

describe('TicketCreatedListener', () => {
  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  };

  let listener: TicketCreatedListener;

  beforeEach(() => {
    // Create an instance of the listener
    listener = new TicketCreatedListener(natsWrapper.client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and save a ticket', async () => {
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data);

    // Write assertions to make sure a ticket was created
    const ticket = (await Ticket.findById(data.id)) as TicketDoc;
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
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
