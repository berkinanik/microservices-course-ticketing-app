import express from 'express';
import { body } from 'express-validator';

import { requireAuthMiddleware, validateRequestMiddleware } from '@b.anik/common';
import { Ticket } from '../models';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuthMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequestMiddleware,
  async (req, res) => {
    const { title, price } = req.body as { title: string; price: number };

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    return res.status(201).send({
      ticket,
    });
  },
);

export { router as newTicketRouter };
