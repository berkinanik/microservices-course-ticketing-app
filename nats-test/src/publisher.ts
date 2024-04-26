import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  stan.on('close', () => {
    console.log('Publisher disconnected from NATS');
    process.exit();
  });

  const data = {
    id: '123',
    title: 'concert',
    price: 20,
  };

  stan.publish('ticket:created', JSON.stringify(data), () => {
    console.log(`Ticket #${data.id} published to NATS`);
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
process.on('SIGUSR2', () => stan.close());
