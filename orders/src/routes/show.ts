import express from 'express';
import { Order } from '../models';
import { requireAuthMiddleware } from '@b.anik/common';

const router = express.Router();

router.get('/api/orders', requireAuthMiddleware, async (req, res) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  return res.status(200).send({
    orders,
  });
});

export { router as showOrderRouter };
