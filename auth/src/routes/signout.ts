import express from 'express';

import { requireAuthMiddleware } from '../middlewares';

const router = express.Router();

router.post('/api/users/signout', requireAuthMiddleware, (req, res) => {
  req.session = null;

  return res.send({});
});

export { router as signOutRouter };
