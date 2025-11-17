import request from 'supertest';
import express from 'express';
import cors from 'cors';
import circlesRouter from '../routes/circles';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/circles', circlesRouter);

describe('circles endpoints', () => {
  it('creates a circle (mock fallback)', async () => {
    const res = await request(app)
      .post('/api/circles')
      .send({ name: 'Test Circle', tokenSymbol: 'TST', benefits: ['A'] });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('name', 'Test Circle');
  });

  it('returns 400 for invalid create payload', async () => {
    const res = await request(app).post('/api/circles').send({});
    expect(res.status).toBe(400);
  });
});
