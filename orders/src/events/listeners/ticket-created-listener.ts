import { Listener, Subjects, TicketCreatedEvent } from '@b.anik/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], _msg: Message) {
    return new Promise<void>(async (resolve, reject) => {
      const { id, title, price, version } = data;

      try {
        const ticket = Ticket.build({
          id,
          title,
          price,
          version,
        });
        await ticket.save();

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
