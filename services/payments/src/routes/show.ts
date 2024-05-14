import {
  NotFoundError,
  requireAuthMiddleware,
  validateRequestMiddleware,
} from '@b.anik/ticketing-common';
import { param } from 'express-validator';
import express from 'express';
import { Payment } from '../models';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

router.get('/api/payments', requireAuthMiddleware, async (req, res) => {
  const payments = await Payment.find({
    userId: req.currentUser!.id,
  }).populate('order');

  return res.status(200).send({ payments });
});

router.get(
  '/api/payments/:id',
  requireAuthMiddleware,
  param('id').not().isEmpty().custom(isValidObjectId).withMessage('Payment ID is required'),
  validateRequestMiddleware,
  async (req, res) => {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.currentUser!.id,
    }).populate('order');

    if (!payment) {
      throw new NotFoundError();
    }

    return res.status(200).send({ payment });
  },
);

export { router as showPaymentRouter };
