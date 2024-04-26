import request from 'supertest';
import { app } from '../../app';
import { getCookieHeader } from '../../test/utils';
import { TicketDoc } from '../../models';

describe('show', () => {
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

  it('should return a 404 if the ticket is not found', async () => {
    await requestAgent.get(`${apiRoute}/there-is-no-ticket`).send().expect(404);
  });

  it('should return the ticket if the ticket is found', async () => {
    const ticket = await requestAgent
      .get(`${apiRoute}/${existingTicket.id}`)
      .send()
      .expect(200)
      .then((res) => res.body?.ticket as TicketDoc);

    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(existingTicket.title);
    expect(ticket.price).toEqual(existingTicket.price);
    expect(ticket.userId).toEqual(existingTicket.userId);
  });
});
