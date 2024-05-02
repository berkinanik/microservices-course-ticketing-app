import { TicketUpdatedEvent } from '@b.anik/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { Ticket, TicketDoc } from '../../../models';

describe('TicketUpdatedListener', () => {
  // Create a fake data event
  let data: TicketUpdatedEvent['data'];

  let listener: TicketUpdatedListener;
  let ticket: TicketDoc;

  beforeEach(async () => {
    // Create an instance of the listener
    listener = new TicketUpdatedListener(natsWrapper.client);

    // Create a ticket
    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
      version: 0,
    });
    await ticket.save();

    data = {
      id: ticket.id,
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: 'updated concert',
      price: 10,
      version: 1,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find, update, and save a ticket', async () => {
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data);

    // Write assertions to make sure a ticket was updated
    const updatedTicket = (await Ticket.findById(data.id)) as TicketDoc;
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
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

  it('should throw an error if the ticket is not found', async () => {
    // Create a fake data event
    data.id = new mongoose.Types.ObjectId().toHexString();

    // Call the onMessage function with the data object + message object
    await expect(listener.onMessage(data)).rejects.toThrow(/ticket not found/i);
  });

  it('should not call ack if the event has a skipped version number', async () => {
    // Create a fake data event
    data.version = 10;

    // Call the onMessage function with the data object + message object
    await expect(listener.onMessage(data)).rejects.toThrow(/ticket not found/i);
  });
});
