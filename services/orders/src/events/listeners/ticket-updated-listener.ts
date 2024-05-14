import { Listener, Subjects, TicketUpdatedEvent } from '@b.anik/ticketing-common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], _msg?: Message) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
          throw new Error('Ticket not found');
        }

        ticket.set({
          title: data.title,
          price: data.price,
          version: data.version,
        });
        await ticket.save();

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
