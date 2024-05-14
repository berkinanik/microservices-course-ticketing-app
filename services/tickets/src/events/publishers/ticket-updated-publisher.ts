import { Publisher, Subjects, TicketUpdatedEvent } from '@b.anik/ticketing-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
