import express from 'express';
import { body } from 'express-validator';
import { isValidObjectId } from 'mongoose';

import {
  BadRequestError,
  requireAuthMiddleware,
  validateRequestMiddleware,
} from '@b.anik/ticketing-common';
import { Order, Ticket, OrderStatus } from '../models';
import { OrderCreatedPublisher } from '../events';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

router.post(
  '/api/orders',
  requireAuthMiddleware,
  body('ticketId')
    .trim()
    .notEmpty()
    .custom((input) => isValidObjectId(input))
    .withMessage('ticketId must be provided'),
  validateRequestMiddleware,
  async (req, res) => {
    const { ticketId } = req.body as { ticketId: string };

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new BadRequestError('Ticket not found');
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt?.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    return res.status(201).send({
      order,
    });
  },
);

export { router as newOrderRouter };
