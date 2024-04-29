import { OrderCancelledEvent, Publisher, Subjects } from '@b.anik/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
