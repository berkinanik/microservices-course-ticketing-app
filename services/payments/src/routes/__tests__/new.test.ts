import request from 'supertest';
import { app } from '../../app';
import { getCookieHeader } from '../../test/utils';
import { Order, OrderDoc, Payment, PaymentDoc } from '../../models';
import mongoose from 'mongoose';
import { OrderStatus } from '@b.anik/ticketing-common';
import { stripe } from '../../stripe';
import { natsWrapper } from '../../nats-wrapper';

describe('new', () => {
  const apiRoute = '/api/payments';
  const userId = new mongoose.Types.ObjectId().toHexString();

  const requestAgent = request.agent(app);

  let cookie: string[];
  let order: OrderDoc;
  const token = 'token';

  beforeAll(() => {
    cookie = getCookieHeader({
      id: userId,
      email: 'user@test.com',
    });
  });

  beforeEach(async () => {
    requestAgent.set('Cookie', cookie);

    order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      status: OrderStatus.AwaitingPayment,
      price: 20,
      version: 0,
    });
    await order.save();
  });

  it('should return 401 if the user is not signed in', async () => {
    requestAgent.set('Cookie', '');

    return requestAgent.post(apiRoute).send({}).expect(401);
  });

  it('should return 404 if the order does not exist', async () => {
    return requestAgent
      .post(apiRoute)
      .send({
        token,
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it('should return 401 if userId does not match the order userId', async () => {
    return requestAgent
      .post(apiRoute)
      .set('Cookie', getCookieHeader({ id: 'other-user-id', email: 'user@test.com' }))
      .send({
        token,
        orderId: order.id,
      })
      .expect(401);
  });

  it('should return 400 if the order is cancelled', async () => {
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    return requestAgent
      .post(apiRoute)
      .send({
        token,
        orderId: order.id,
      })
      .expect(400)
      .then((response) => expect(response.body.errors[0].message).toMatch(/cancelled/i));
  });

  it('should call the stripe API with the correct arguments', async () => {
    const spy = jest.spyOn(stripe.charges, 'create');

    await requestAgent.post(apiRoute).send({ token, orderId: order.id }).expect(201);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
  });

  it('should return 201 with the payment details if the payment is successful', async () => {
    return requestAgent
      .post(apiRoute)
      .send({ token, orderId: order.id })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBeTruthy();
        expect(response.body.payment).toBeDefined();
        expect(response.body.payment.stripeId).toEqual('stripe-id');
        expect(response.body.payment.order.id).toEqual(order.id);
      });
  });

  it('should return 400 if the payment fails', async () => {
    const spy = jest
      .spyOn(stripe.charges, 'create')
      .mockResolvedValueOnce({ id: 'stripe-id', paid: false } as any);

    return requestAgent
      .post(apiRoute)
      .send({ token, orderId: order.id })
      .expect(400)
      .then((response) => expect(response.body.errors[0].message).toMatch(/payment failed/i));
  });

  it('should save the payment to the database', async () => {
    await requestAgent.post(apiRoute).send({ token, orderId: order.id }).expect(201);

    const payment = (await Payment.findOne({ order: order.id }).populate(
      'order',
    )) as PaymentDoc | null;

    expect(payment).toBeDefined();
  });

  it('should publish a payment complete event', async () => {
    const spy = jest.spyOn(natsWrapper.client, 'publish');

    await requestAgent.post(apiRoute).send({ token, orderId: order.id }).expect(201);

    expect(spy).toHaveBeenCalledTimes(1);
    const eventName = spy.mock.calls[0][0];
    expect(eventName).toEqual('payment:complete');
    const eventData = JSON.parse(spy.mock.calls[0][1] as string);
    expect(eventData.orderId).toEqual(order.id);
  });
});
