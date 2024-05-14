import { OrderUpdatedEvent, Publisher, Subjects } from '@b.anik/ticketing-common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}
