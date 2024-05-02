import request from 'supertest';
import mongoose from 'mongoose';

import { getCookieHeader } from '../../test/utils';
import { app } from '../../app';
import { Order, OrderDoc, Ticket } from '../../models';

describe('show', () => {
  const apiRoute = '/api/orders';

  const requestAgent = request.agent(app);

  let cookie: string[];

  beforeAll(() => {
    cookie = getCookieHeader();
  });

  beforeEach(() => {
    requestAgent.set('Cookie', cookie);
  });

  describe('show all orders', () => {
    it('should return 401 if the user is not signed in', async () => {
      requestAgent.set('Cookie', '');

      return requestAgent.get(apiRoute).send({}).expect(401);
    });

    it('should return a status other than 401 if the user is signed in', async () => {
      return requestAgent
        .get(apiRoute)
        .send()
        .expect((response) => {
          expect(response.status).not.toEqual(401);
        });
    });

    it('should return the orders for the user', async () => {
      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        version: 0,
      });
      await ticket.save();

      const order = Order.build({
        userId: 'user-id-123',
        expiresAt: new Date(),
        ticket,
      });
      await order.save();

      return requestAgent
        .get(apiRoute)
        .send({})
        .expect(200)
        .then((response) => {
          const orders: OrderDoc[] = response.body.orders;

          expect(orders.length).toEqual(1);
          expect(orders[0].ticket.id).toEqual(ticket.id);
        });
    });

    it('should not return the orders for other users', async () => {
      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        version: 0,
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

      return requestAgent
        .get(apiRoute)
        .send({})
        .expect(200)
        .then((response) => {
          const orders: OrderDoc[] = response.body.orders;

          expect(orders.length).toEqual(1);
          expect(orders[0].ticket.id).toEqual(ticket.id);
        });
    });
  });

  describe('show order', () => {
    it('should return 401 if the user is not signed in', async () => {
      requestAgent.set('Cookie', '');

      return requestAgent
        .get(`${apiRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
        .send({})
        .expect(401);
    });

    it('should return a status other than 401 if the user is signed in', async () => {
      return requestAgent
        .get(`${apiRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
        .send()
        .expect((response) => {
          expect(response.status).not.toEqual(401);
        });
    });

    it('should return the order', async () => {
      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        version: 0,
      });
      await ticket.save();

      const order = Order.build({
        userId: 'user-id-123',
        expiresAt: new Date(),
        ticket,
      });
      await order.save();

      return requestAgent
        .get(`${apiRoute}/${order.id}`)
        .send({})
        .expect(200)
        .then((response) => {
          const order: OrderDoc = response.body.order;

          expect(order.ticket.id).toEqual(ticket.id);
        });
    });

    it('should return 404 if the order is not found', async () => {
      return requestAgent
        .get(`${apiRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
        .send({})
        .expect(404);
    });

    it('should not return the orders for other users', async () => {
      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        version: 0,
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

      return requestAgent.get(`${apiRoute}/${anotherOrder.id}`).send({}).expect(401);
    });
  });
});
