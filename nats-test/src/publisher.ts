import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  stan.on('close', () => {
    console.log('Publisher disconnected from NATS');
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.log(err);
  }
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
process.on('SIGUSR2', () => stan.close());
