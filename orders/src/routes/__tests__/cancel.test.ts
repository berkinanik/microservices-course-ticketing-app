import request from 'supertest';
import mongoose from 'mongoose';

import { getCookieHeader } from '../../test/utils';
import { app } from '../../app';
import { Order, OrderDoc, OrderStatus, Ticket } from '../../models';

describe('cancel', () => {
  const getApiRoute = (orderId: string) => `/api/orders/${orderId}/cancel`;

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

    return requestAgent
      .patch(getApiRoute(new mongoose.Types.ObjectId().toHexString()))
      .send()
      .expect(401);
  });

  it('should return a status other than 401 if the user is signed in', async () => {
    return requestAgent
      .patch(getApiRoute(new mongoose.Types.ObjectId().toHexString()))
      .send()
      .expect((response) => {
        expect(response.status).not.toEqual(401);
      });
  });

  it('should return 404 if the order is not found', async () => {
    return requestAgent
      .patch(getApiRoute(new mongoose.Types.ObjectId().toHexString()))
      .send()
      .expect(404);
  });

  it('should not cancel the orders for other users', async () => {
    const ticket = Ticket.build({
      title: 'Concert',
      price: 20,
    });
    await ticket.save();

    const order = Order.build({
      userId: 'user-id-123',
      expiresAt: new Date(),
      ticket,
    });
    await order.save();

    const anotherOrder = Order.build({
      userId: 'another-user-id-123',
      expiresAt: new Date(),
      ticket,
    });
    await anotherOrder.save();

    return requestAgent.patch(getApiRoute(anotherOrder.id)).send().expect(401);
  });

  it('should cancel the order', async () => {
    const ticket = Ticket.build({
      title: 'Concert',
      price: 20,
    });
    await ticket.save();

    const order = Order.build({
      userId: 'user-id-123',
      expiresAt: new Date(),
      ticket,
    });
    await order.save();

    await requestAgent
      .patch(getApiRoute(order.id))
      .send({})
      .expect(200)
      .then((response) => {
        const order: OrderDoc = response.body.order;

        expect(order.status).toMatch(OrderStatus.Cancelled);
      });

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toMatch(OrderStatus.Cancelled);
  });
});
