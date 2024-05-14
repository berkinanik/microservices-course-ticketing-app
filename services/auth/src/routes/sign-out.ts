import express from 'express';

import { requireAuthMiddleware } from '@b.anik/ticketing-common';

const router = express.Router();

router.post('/api/users/sign-out', requireAuthMiddleware, (req, res) => {
  req.session = null;

  return res.send({});
});

export { router as signOutRouter };
