import express from 'express';

const router = express.Router();

router.get('/api/tickets/health', (req, res) => res.status(200).send({}));

export { router as healthRouter };
