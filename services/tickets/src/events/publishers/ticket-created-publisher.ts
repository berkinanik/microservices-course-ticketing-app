import { Publisher, Subjects, TicketCreatedEvent } from '@b.anik/ticketing-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
