import {
  NotAuthorizedError,
  NotFoundError,
  requireAuthMiddleware,
  validateRequestMiddleware,
} from '@b.anik/common';
import express from 'express';
import { body } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { Ticket, TicketDoc } from '../models';
import { TicketUpdatedPublisher } from '../events';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuthMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequestMiddleware,
  async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new NotFoundError();
    }

    const ticket = (await Ticket.findById(id)) as TicketDoc | null;

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.title = req.body.title;
    ticket.price = req.body.price;

    const updatedTicket = await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: updatedTicket.id,
      version: updatedTicket.version,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId,
    });

    return res.status(200).send({
      ticket,
    });
  },
);

export { router as updateTicketRouter };
