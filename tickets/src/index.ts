import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'tickets', 'http://nats-srv:4222');
    console.log('Connected to NATS!');

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit(1);
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGUSR2', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log(err);
    process.exit();
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
