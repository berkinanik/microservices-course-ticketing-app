import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { startListeners } from './events';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

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

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
