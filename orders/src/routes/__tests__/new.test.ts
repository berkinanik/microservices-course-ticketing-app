import request from 'supertest';
import mongoose from 'mongoose';

import { getCookieHeader } from '../../test/utils';
import { app } from '../../app';
import { Order, OrderDoc, Ticket } from '../../models';
import { natsWrapper } from '../../nats-wrapper';

describe('new', () => {
  const apiRoute = '/api/orders';

  const requestAgent = request.agent(app);

  let cookie: string[];

  beforeAll(() => {
    cookie = getCookieHeader();
  });

  beforeEach(() => {
    requestAgent.set('Cookie', cookie);
  });

  it('should return 401 if the user is not signed in', async () => {
    requestAgent.set('Cookie', '');

    return requestAgent.post(apiRoute).send({}).expect(401);
  });

  it('should return a status other than 401 if the user is signed in', async () => {
    return requestAgent
      .post(apiRoute)
      .send({
        ticketId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect((response) => {
        expect(response.status).not.toEqual(401);
      });
  });

  it('should return an error if an invalid ticketId is provided', async () => {
    await requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({
        ticketId: '',
      })
      .expect(400)
      .then((response) => {
        expect(response.body.errors[0].field).toEqual('ticketId');
      });

    return requestAgent
      .post(apiRoute)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.errors[0].field).toEqual('ticketId');
      });
  });

  it('should return an error if the ticket does not exist', async () => {
    return requestAgent
      .post(apiRoute)
      .send({
        ticketId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(400)
      .then((response) => {
        expect(response.body.errors[0].message).toMatch(/ticket not found/i);
      });
  });

  it('should return an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });
    await ticket.save();
    const order = Order.build({
      ticket,
      userId: 'user1',
      expiresAt: new Date(),
    });
    await order.save();

    return requestAgent
      .post(apiRoute)
      .send({
        ticketId: ticket.id,
      })
      .expect(400)
      .then((response) => {
        expect(response.body.errors[0].message).toMatch(/ticket is already reserved/i);
      });
  });

  it('should create an order', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });
    await ticket.save();

    const orders = await Order.countDocuments().then((count) => count);
    expect(orders).toEqual(0);

    const order = await requestAgent
      .post(apiRoute)
      .send({
        ticketId: ticket.id,
      })
      .expect(201)
      .then((res) => res.body.order as OrderDoc);

    const updatedOrders = await Order.countDocuments().then((count) => count);
    expect(updatedOrders).toEqual(1);

    expect(order.ticket.id).toEqual(ticket.id);
    expect(order.userId).toEqual('user-id-123');
    expect(order.status).toMatch(/created/i);
  });

  it('should publish an event after creating an order', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 20,
    });
    await ticket.save();

    const order = await requestAgent
      .post(apiRoute)
      .send({ ticketId: ticket.id })
      .expect(201)
      .then((res) => res.body.order as OrderDoc);

    const spy = jest.spyOn(natsWrapper.client, 'publish');
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
    const eventName = spy.mock.calls[0][0];
    expect(eventName).toEqual('order:created');
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);
    expect(eventData).toEqual(
      expect.objectContaining({
        id: order.id,
        status: order.status,
        userId: order.userId,
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
        ...(order.expiresAt ? { expiresAt: new Date(order.expiresAt).toISOString() } : {}),
      }),
    );
  });
});
