import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models';

describe('show', () => {
  const apiRoute = '/api/tickets';

  const requestAgent = request.agent(app);

  let existingTicket: TicketDoc;

  beforeEach(async () => {
    existingTicket = await Ticket.build({
      userId: 'user-id-123',
      title: 'ticket-does-exist',
      price: 30,
    }).save();
  });

  describe('get one ticket', () => {
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

  describe('get all tickets', () => {
    it('should return all tickets', async () => {
      const tickets = await requestAgent
        .get(apiRoute)
        .send()
        .expect(200)
        .then((res) => res.body?.tickets as TicketDoc[]);

      expect(tickets).toBeDefined();
      expect(tickets.length).toEqual(1);
      expect(tickets[0].title).toEqual(existingTicket.title);
      expect(tickets[0].price).toEqual(existingTicket.price);
      expect(tickets[0].userId).toEqual(existingTicket.userId);
    });
  });
});
