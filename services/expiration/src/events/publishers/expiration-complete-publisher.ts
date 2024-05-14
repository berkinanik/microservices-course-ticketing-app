import { ExpirationCompleteEvent, Publisher, Subjects } from '@b.anik/ticketing-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
