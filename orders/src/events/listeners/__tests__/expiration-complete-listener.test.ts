import { ExpirationCompleteEvent, OrderStatus } from '@b.anik/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order, OrderDoc, Ticket, TicketDoc } from '../../../models';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';

describe('ExpirationCompleteListener', () => {
  let data: ExpirationCompleteEvent['data'];
  let listener: ExpirationCompleteListener;
  let ticket: TicketDoc;

  beforeEach(async () => {
    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      title: 'concert',
      version: 0,
    });
    await ticket.save();

    const order = Order.build({
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      ticket,
    });
    await order.save();

    data = {
      orderId: order.id,
    };

    listener = new ExpirationCompleteListener(natsWrapper.client);
  });

  it('should cancel the order', async () => {
    await listener.onMessage(data);

    const cancelledOrder = (await Order.findById(data.orderId)) as OrderDoc;
    expect(cancelledOrder.status).toMatch(OrderStatus.Cancelled);
  });

  it('should resolve a promise', async () => {
    await expect(listener.onMessage(data)).resolves.toBeUndefined();
  });

  it('should publish order cancelled event', async () => {
    await listener.onMessage(data);

    const spy = jest.spyOn(natsWrapper.client, 'publish');
    expect(spy).toHaveBeenCalledTimes(1);
    const eventName = spy.mock.calls[0][0];
    expect(eventName).toMatch('order:cancelled');
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);
    expect(eventData).toEqual(
      expect.objectContaining({
        id: data.orderId,
        ticket: {
          id: ticket.id,
        },
      }),
    );
  });

  it('should resolve without publishing if order is already cancelled', async () => {
    const order = (await Order.findById(data.orderId)) as OrderDoc;
    order.status = OrderStatus.Cancelled;
    await order.save();

    await expect(listener.onMessage(data)).resolves.toBeUndefined();

    const spy = jest.spyOn(natsWrapper.client, 'publish');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should reject if order not found', async () => {
    await expect(
      listener.onMessage({
        orderId: new mongoose.Types.ObjectId().toHexString(),
      }),
    ).rejects.toThrow(/order not found/i);
  });
});
