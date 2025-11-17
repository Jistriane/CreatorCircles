import request from 'supertest';
import app from '../index';

describe('POST /api/buy-token', () => {
  it('deve registrar compra de token', async () => {
    const res = await request(app)
      .post('/api/buy-token')
      .send({ circleId: 'dvc', userId: 'user123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.purchase.circleId).toBe('dvc');
  }, 20000);

  it('deve falhar sem circleId', async () => {
    const res = await request(app)
      .post('/api/buy-token')
      .send({ userId: 'user123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 20000);
});
