import { Listener, OrderCancelledEvent, Subjects } from '@b.anik/ticketing-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket, TicketDoc } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    _msg?: Message,
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const ticketId = data.ticket.id;

        const ticket = (await Ticket.findOne({
          _id: ticketId,
          orderId: data.id,
        })) as TicketDoc;

        if (!ticket) {
          throw new Error('Ticket not found');
        }

        ticket.orderId = undefined;
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
