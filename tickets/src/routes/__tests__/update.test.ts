import request from 'supertest';
import mongoose from 'mongoose';
import { TicketDoc } from '../../models';
import { getCookieHeader } from '../../test/utils';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

describe('update', () => {
  const apiRoute = '/api/tickets';

  const requestAgent = request.agent(app);

  let existingTicket: TicketDoc;

  beforeEach(async () => {
    const cookie = getCookieHeader();

    await requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({
        title: 'ticket-does-exist',
        price: 30,
      })
      .expect(201)
      .then((res) => {
        existingTicket = res.body.ticket;
      });
  });

  it('should get a 401 if the user is not authenticated', async () => {
    await request(app).put(`${apiRoute}/${existingTicket.id}`).send().expect(401);

    requestAgent.set('Cookie', getCookieHeader());
  });

  it('should return a 404 if the ticket is not found', async () => {
    return requestAgent
      .put(`${apiRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
      .send({
        title: 'updated-title',
        price: 50,
      })
      .expect(404);
  });

  it('should return a 401 if user is not the owner of the ticket', async () => {
    return request(app)
      .put(`${apiRoute}/${existingTicket.id}`)
      .set(
        'Cookie',
        getCookieHeader({
          id: 'another-user-id',
          email: 'user2@test.com',
        }),
      )
      .send({
        title: 'updated-title',
        price: 50,
      })
      .expect(401);
  });

  it('should return 400 if user provides invalid title or price', async () => {
    await requestAgent
      .put(`${apiRoute}/${existingTicket.id}`)
      .send({
        title: 'This is a valid title',
        price: -10,
      })
      .expect(400);
    await requestAgent
      .put(`${apiRoute}/${existingTicket.id}`)
      .send({
        title: '',
        price: 20,
      })
      .expect(400);
    return requestAgent
      .put(`${apiRoute}/${existingTicket.id}`)
      .send({
        title: '',
        price: -10,
      })
      .expect(400);
  });

  it('should update the ticket with given payload', async () => {
    const existingTicketCopy = structuredClone(existingTicket);

    const updatedTicket = await requestAgent
      .put(`${apiRoute}/${existingTicket.id}`)
      .send({
        title: 'updated-title',
        price: 50,
      })
      .expect(200)
      .then((res) => res.body?.ticket as TicketDoc);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket.title).toEqual('updated-title');
    expect(updatedTicket.price).toEqual(50);
    expect(updatedTicket.userId).toEqual(existingTicket.userId);
    expect(updatedTicket.id).toEqual(existingTicket.id);
  });

  it('should publish a ticket:updated event', async () => {
    const updatedTicket = await requestAgent
      .put(`${apiRoute}/${existingTicket.id}`)
      .send({
        title: 'updated-title',
        price: 50,
      })
      .expect(200)
      .then((res) => res.body?.ticket as TicketDoc);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      expect.stringContaining('ticket:updated'),
      expect.stringContaining(updatedTicket.id),
      expect.any(Function),
    );
  });
});
