import nats, { type Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

  const options = stan
    .subscriptionOptions()
    // require manual acknowledgment of messages
    .setManualAckMode(true)
    // deliver all messages from the beginning
    .setDeliverAllAvailable()
    // deliver only the messages that have not been acknowledged
    .setDurableName('queue-durable-name');
  const subscription = stan.subscribe('ticket:created', 'queue-group-name', options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Message#${msg.getSequence()} received:`, JSON.parse(data));
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
process.on('SIGUSR2', () => stan.close());
