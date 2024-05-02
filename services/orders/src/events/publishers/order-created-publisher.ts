import { OrderCreatedEvent, Publisher, Subjects } from '@b.anik/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
