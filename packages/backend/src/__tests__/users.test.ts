import request from 'supertest';
import express from 'express';
import cors from 'cors';
import usersRouter from '../routes/users';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);

describe('users endpoints', () => {
  it('returns 400 for join without payload', async () => {
    const res = await request(app).post('/api/users/join').send({});
    expect(res.status).toBe(400);
  });

  it('creates user join in mock mode', async () => {
    const res = await request(app).post('/api/users/join').send({ wallet: '0xabc', circleSymbol: 'DVC', tokens: 100 });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('wallet', '0xabc');
  });
});
