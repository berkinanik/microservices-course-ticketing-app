import express from 'express';

const router = express.Router();

router.get('/api/orders', async (req, res) => {
  res.send({});
});

export { router as showOrderRouter };
