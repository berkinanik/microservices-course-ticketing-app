import express from 'express';

const router = express.Router();

router.get('/api/orders/health', (req, res) => res.status(200).send({}));

export { router as healthRouter };
