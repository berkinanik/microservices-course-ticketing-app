import express from 'express';
import { requireAuthMiddleware } from '../middlewares';

const router = express.Router();

router.get('/api/users/current-user', requireAuthMiddleware, (req, res) => {
  res.send({
    currentUser: req.currentUser || null,
  });
});

export { router as currentUserRouter };
