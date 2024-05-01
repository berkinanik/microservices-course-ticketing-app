import { Listener, OrderCreatedEvent, Subjects } from '@b.anik/common';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDoc } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = 'tickets-service';

  onMessage(data: OrderCreatedEvent['data'], _msg?: Message) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const ticketId = data.ticket.id;

        // Mark the ticket as reserved by setting its orderId property
        const ticket = (await Ticket.findById(ticketId)) as TicketDoc;

        if (!ticket) {
          throw new Error('Ticket not found');
        }

        ticket.orderId = data.id;
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
          id: ticket.id,
          version: ticket.version,
          title: ticket.title,
          price: ticket.price,
          userId: ticket.userId,
          orderId: ticket.orderId,
        });

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
