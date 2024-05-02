import { startListeners } from './events';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!,
    );
    console.log('Connected to NATS!');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit(1);
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGUSR2', () => natsWrapper.client.close());

    startListeners(natsWrapper.client);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
