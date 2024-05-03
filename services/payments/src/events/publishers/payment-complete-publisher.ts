import { PaymentCompleteEvent, Publisher, Subjects } from '@b.anik/common';

export class PaymentCompletePublisher extends Publisher<PaymentCompleteEvent> {
  readonly subject = Subjects.PaymentComplete;
}
