import express from 'express';
import { body } from 'express-validator';

import { requireAuthMiddleware, validateRequestMiddleware } from '@b.anik/common';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuthMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequestMiddleware,
  (req, res) => {
    return res.sendStatus(201);
  },
);

export { router as newTicketRouter };
