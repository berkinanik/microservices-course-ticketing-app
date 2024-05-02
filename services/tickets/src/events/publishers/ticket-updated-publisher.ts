import { Publisher, Subjects, TicketUpdatedEvent } from '@b.anik/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
