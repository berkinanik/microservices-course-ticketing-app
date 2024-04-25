import { requireAuthMiddleware } from '@b.anik/common';
import express from 'express';

const router = express.Router();

router.post('/api/tickets', requireAuthMiddleware, (req, res) => {
  return res.sendStatus(201);
});

export { router as newTicketRouter };
