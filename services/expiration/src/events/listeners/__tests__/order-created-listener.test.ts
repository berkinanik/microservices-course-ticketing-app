import { OrderCreatedEvent, OrderStatus } from '@b.anik/ticketing-common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { expirationQueue } from '../../../queues';

describe('OrderCreatedListener', () => {
  const eventData: OrderCreatedEvent['data'] = {
    id: '123456789abc',
    version: 0,
    status: OrderStatus.Created,
    ticket: {
      id: '987654321abc',
      price: 10,
    },
    userId: 'abc123456789',
  };
  let listener: OrderCreatedListener;

  beforeEach(async () => {
    listener = new OrderCreatedListener(natsWrapper.client);
  });

  it('should add a job to expiration queue', async () => {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 15 * 60);
    await listener.onMessage({
      ...eventData,
      expiresAt: expiresAt.toISOString(),
    });

    const spy = jest.spyOn(expirationQueue, 'add');
    expect(spy).toHaveBeenCalledTimes(1);
    const data = spy.mock.calls[0][0];
    expect(data).toEqual({ orderId: eventData.id });
    const { delay } = spy.mock.calls[0][1] as any as { delay: number };
    expect(delay).toBeGreaterThan(0);
  });

  it('should resolve a promise', async () => {
    await expect(
      listener.onMessage({
        ...eventData,
        expiresAt: new Date().toISOString(),
      }),
    ).resolves.toBeUndefined();
  });

  it('should resolve without adding a job if expiresAt is undefined', async () => {
    await expect(listener.onMessage(eventData)).resolves.toBeUndefined();

    const spy = jest.spyOn(expirationQueue, 'add');
    expect(spy).not.toHaveBeenCalled();
  });
});
