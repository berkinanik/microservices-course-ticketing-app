import { OrderCreatedEvent, Publisher, Subjects } from '@b.anik/ticketing-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
