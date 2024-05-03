import request from 'supertest';
import { app } from '../../app';
import { getCookieHeader } from '../../test/utils';
import mongoose from 'mongoose';
import { Payment } from '../../models';

describe('show', () => {
  const requestAgent = request.agent(app);

  let cookie: string[];
  const user = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'user@test.com',
  };

  beforeAll(() => {
    cookie = getCookieHeader(user);
  });

  beforeEach(() => {
    requestAgent.set('Cookie', cookie);
  });

  describe('all payments', () => {
    const apiRoute = '/api/payments';

    it('should return 401 if user is not authenticated', async () => {
      requestAgent.set('Cookie', []);

      return requestAgent.get(apiRoute).expect(401);
    });

    it('should return 200 with empty array if no payments found', async () => {
      const response = await requestAgent.get(apiRoute).expect(200);

      expect(response.body.payments).toEqual([]);
    });

    it('should return 200 with payments if found', async () => {
      const payment1 = Payment.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'stripe-id-1',
        userId: user.id,
      });
      const payment2 = Payment.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'stripe-id-2',
        userId: user.id,
      });
      await payment1.save();
      await payment2.save();

      return requestAgent
        .get(apiRoute)
        .expect(200)
        .then((response) => {
          expect(response.body.payments.length).toEqual(2);
          expect(response.body.payments[0].orderId).toEqual(payment1.orderId);
          expect(response.body.payments[1].orderId).toEqual(payment2.orderId);
        });
    });

    it('should not return other user payments', async () => {
      const payment1 = Payment.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'stripe-id-1',
        userId: user.id,
      });
      const payment2 = Payment.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'stripe-id-2',
        userId: new mongoose.Types.ObjectId().toHexString(),
      });
      await payment1.save();
      await payment2.save();

      return requestAgent
        .get(apiRoute)
        .expect(200)
        .then((response) => {
          expect(response.body.payments.length).toEqual(1);
          expect(response.body.payments[0].orderId).toEqual(payment1.orderId);
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
      const payment = Payment.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'stripe-id-1',
        userId: user.id,
      });
      await payment.save();

      return requestAgent
        .get(getApiRoute(payment.id))
        .expect(200)
        .then((response) => {
          expect(response.body.payment.orderId).toEqual(payment.orderId);
        });
    });

    it('should not return other user payment', async () => {
      const payment = Payment.build({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'stripe-id-1',
        userId: new mongoose.Types.ObjectId().toHexString(),
      });
      await payment.save();

      return requestAgent.get(getApiRoute(payment.id)).expect(404);
    });
  });
});
