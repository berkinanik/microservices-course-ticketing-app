import express from 'express';
import { body } from 'express-validator';

import { requireAuthMiddleware, validateRequestMiddleware } from '@b.anik/common';
import { Ticket } from '../models';
import { TicketCreatedPublisher } from '../events';
import { natsWrapper } from '../nats-wrapper';

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

    const savedTicket = await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: savedTicket.id,
      version: savedTicket.version,
      title: savedTicket.title,
      price: savedTicket.price,
      userId: savedTicket.userId,
    });

    return res.status(201).send({
      ticket: savedTicket,
    });
  },
);

export { router as newTicketRouter };
