import express from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuthMiddleware,
  validateRequestMiddleware,
} from '@b.anik/common';
import { Order, OrderDoc } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuthMiddleware,
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
  validateRequestMiddleware,
  async (req, res) => {
    const { token, orderId } = req.body as { token: string; orderId: string };

    const order = (await Order.findById(orderId)) as OrderDoc | null;

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    res.status(201).send({ success: true });
  },
);

export { router as newPaymentRouter };
