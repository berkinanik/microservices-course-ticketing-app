import express from 'express';

import { requireAuthMiddleware } from '@b.anik/common';

const router = express.Router();

router.post('/api/users/signout', requireAuthMiddleware, (req, res) => {
  req.session = null;

  return res.send({});
});

export { router as signOutRouter };
