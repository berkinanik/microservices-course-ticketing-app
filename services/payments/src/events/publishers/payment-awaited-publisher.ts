import { PaymentAwaitedEvent, Publisher, Subjects } from '@b.anik/ticketing-common';

export class PaymentAwaitedPublisher extends Publisher<PaymentAwaitedEvent> {
  readonly subject = Subjects.PaymentAwaited;
}
