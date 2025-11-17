import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRouter from '../routes/auth';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

describe('auth routes', () => {
  it('returns 400 when no sessionToken', async () => {
    const res = await request(app).post('/auth/verify').send({});
    expect(res.status).toBe(400);
  });

  it('returns mock verification when FEATURE_WAL=false', async () => {
    process.env.FEATURE_WAL = 'false';
    const res = await request(app).post('/auth/verify').send({ sessionToken: 'abcd1234' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('valid', true);
  });
});
