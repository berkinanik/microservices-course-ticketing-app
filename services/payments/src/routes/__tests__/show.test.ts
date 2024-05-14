import request from 'supertest';
import { app } from '../../app';
import { getCookieHeader } from '../../test/utils';
import mongoose from 'mongoose';
import { Order, OrderDoc, Payment, PaymentDoc } from '../../models';
import { OrderStatus } from '@b.anik/ticketing-common';

describe('show', () => {
  const requestAgent = request.agent(app);

  let cookie: string[];
  const user = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'user@test.com',
  };
  let order1: OrderDoc;
  let order2: OrderDoc;
  let payment1: PaymentDoc;
  let payment2: PaymentDoc;

  beforeAll(() => {
    cookie = getCookieHeader(user);
  });

  beforeEach(async () => {
    requestAgent.set('Cookie', cookie);

    order1 = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: user.id,
      price: 10,
      status: OrderStatus.AwaitingPayment,
      version: 0,
    });
    await order1.save();

    order2 = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: user.id,
      price: 20,
      status: OrderStatus.Cancelled,
      version: 0,
    });
    await order2.save();

    payment1 = Payment.build({
      order: order1,
      stripeId: 'stripe-id-1',
      userId: order1.userId,
    });
    await payment1.save();

    payment2 = Payment.build({
      order: order2,
      stripeId: 'stripe-id-2',
      userId: order2.userId,
    });
    await payment2.save();
  });

  describe('all payments', () => {
    const apiRoute = '/api/payments';

    it('should return 401 if user is not authenticated', async () => {
      requestAgent.set('Cookie', []);

      return requestAgent.get(apiRoute).expect(401);
    });

    it('should return 200 with empty array if no payments found', async () => {
      await Payment.deleteMany({});

      const response = await requestAgent.get(apiRoute).expect(200);

      expect(response.body.payments).toEqual([]);
    });

    it('should return 200 with payments if found', async () => {
      return requestAgent
        .get(apiRoute)
        .expect(200)
        .then((response) => {
          expect(response.body.payments.length).toEqual(2);
          expect(response.body.payments[0].order.id).toEqual(payment1.order.id);
          expect(response.body.payments[1].order.id).toEqual(payment2.order.id);
        });
    });

    it('should not return other user payments', async () => {
      const payment = Payment.build({
        order: order1,
        stripeId: 'stripe-id-2',
        userId: new mongoose.Types.ObjectId().toHexString(),
      });
      await payment.save();

      return requestAgent
        .get(apiRoute)
        .expect(200)
        .then((response) => {
          expect(response.body.payments.length).toEqual(2);
          expect(response.body.payments[0].order.id).toEqual(payment1.order.id);
          expect(response.body.payments[1].order.id).toEqual(payment2.order.id);
        });
    });
  });

  describe('show one payment', () => {
    const getApiRoute = (id: string) => `/api/payments/${id}`;

    it('should return 401 if user is not authenticated', async () => {
      requestAgent.set('Cookie', []);

      return requestAgent.get(getApiRoute('123')).expect(401);
    });

    it('should return 400 if invalid payment id', async () => {
      return requestAgent.get(getApiRoute('123')).expect(400);
    });

    it('should return 404 if payment not found', async () => {
      return requestAgent.get(getApiRoute(new mongoose.Types.ObjectId().toHexString())).expect(404);
    });

    it('should return 200 with payment if found', async () => {
      return requestAgent
        .get(getApiRoute(payment1.id))
        .expect(200)
        .then((response) => {
          expect(response.body.payment.order.id).toEqual(payment1.order.id);
        });
    });

    it('should not return other user payment', async () => {
      const payment = Payment.build({
        order: order1,
        stripeId: 'stripe-id-1',
        userId: new mongoose.Types.ObjectId().toHexString(),
      });
      await payment.save();

      return requestAgent.get(getApiRoute(payment.id)).expect(404);
    });
  });
});
