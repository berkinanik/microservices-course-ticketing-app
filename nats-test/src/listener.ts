import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log(`Listener#${clientId} connected to NATS`);

  stan.on('close', () => {
    console.log(`Listener#${clientId} disconnected from NATS`);
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
process.on('SIGUSR2', () => stan.close());
