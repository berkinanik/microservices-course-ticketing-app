import { ExpirationCompleteEvent, Publisher, Subjects } from '@b.anik/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
