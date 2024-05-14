import express from 'express';
import { Ticket } from '../models';
import { NotFoundError } from '@b.anik/ticketing-common';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

router.get('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new NotFoundError();
  }

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  return res.status(200).send({ ticket });
});

router.get('/api/tickets', async (req, res) => {
  const tickets = await Ticket.find({});

  return res.status(200).send({ tickets });
});

export { router as showTicketRouter };
