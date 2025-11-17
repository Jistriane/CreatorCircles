import client from 'prom-client';
import express from 'express';

const router = express.Router();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

router.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;
