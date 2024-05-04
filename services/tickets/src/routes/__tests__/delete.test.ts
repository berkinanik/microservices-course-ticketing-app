import request from 'supertest';
import mongoose from 'mongoose';
import { Ticket, TicketDoc } from '../../models';
import { getCookieHeader } from '../../test/utils';
import { app } from '../../app';

describe('delete', () => {
  const apiRoute = '/api/tickets';

  const requestAgent = request.agent(app);

  let existingTicket: TicketDoc;

  beforeEach(async () => {
    const cookie = getCookieHeader();

    existingTicket = await Ticket.build({
      title: 'concert',
      price: 20,
      userId: 'user-id-123',
    }).save();

    requestAgent.set('Cookie', cookie);
  });

  it('should get a 401 if the user is not authenticated', async () => {
    await request(app).delete(`${apiRoute}/${existingTicket.id}`).send().expect(401);

    requestAgent.set('Cookie', getCookieHeader());
  });

  it('should return a 404 if the ticket is not found', async () => {
    return requestAgent
      .delete(`${apiRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
      .send()
      .expect(404);
  });

  it('should return a 401 if user is not the owner of the ticket', async () => {
    return request(app)
      .delete(`${apiRoute}/${existingTicket.id}`)
      .set(
        'Cookie',
        getCookieHeader({
          id: 'another-user-id',
          email: 'user2@test.com',
        }),
      )
      .send()
      .expect(401);
  });

  it('should return a 400 if the ticket is reserved', async () => {
    existingTicket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await existingTicket.save();

    return requestAgent.delete(`${apiRoute}/${existingTicket.id}`).send().expect(400);
  });

  it('should delete the ticket', async () => {
    const deletedTicket = await requestAgent
      .delete(`${apiRoute}/${existingTicket.id}`)
      .send()
      .expect(200)
      .then((res) => res.body?.ticket as TicketDoc);

    expect(deletedTicket).toBeDefined();
    expect(deletedTicket.id).toEqual(existingTicket.id);

    return requestAgent.get(`${apiRoute}/${existingTicket.id}`).send().expect(404);
  });
});
