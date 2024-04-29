import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuthMiddleware,
} from '@b.anik/common';
import express from 'express';
import { param } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { Order } from '../models';
import { OrderCancelledPublisher } from '../events';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/api/orders/:orderId/cancel',
  requireAuthMiddleware,
  param('orderId')
    .trim()
    .notEmpty()
    .custom((input) => isValidObjectId(input))
    .withMessage('orderId is required'),
  async (req, res) => {
    const { orderId } = req.params as { orderId: string };

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event saying that an order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    return res.status(200).send({
      order,
    });
  },
);

export { router as cancelOrderRouter };
