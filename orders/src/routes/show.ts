import express from 'express';
import { Order } from '../models';
import { NotAuthorizedError, NotFoundError, requireAuthMiddleware } from '@b.anik/common';
import { param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

router.get('/api/orders', requireAuthMiddleware, async (req, res) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  return res.status(200).send({
    orders,
  });
});

router.get(
  '/api/orders/:orderId',
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

    return res.status(200).send({
      order,
    });
  },
);

export { router as showOrderRouter };
