import { OrderCancelledEvent, Publisher, Subjects } from '@b.anik/ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
