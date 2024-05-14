import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuthMiddleware,
} from '@b.anik/ticketing-common';
import express from 'express';
import { isValidObjectId } from 'mongoose';
import { Ticket, TicketDoc } from '../models';

const router = express.Router();

router.delete('/api/tickets/:id', requireAuthMiddleware, async (req, res) => {
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

  if (ticket.orderId) {
    throw new BadRequestError('Cannot delete a reserved ticket');
  }

  const deletedTicket = await Ticket.findOneAndDelete({
    _id: ticket.id,
    userId: req.currentUser!.id,
  });

  return res.status(200).send({ ticket: deletedTicket });
});

export { router as deleteTicketRouter };
