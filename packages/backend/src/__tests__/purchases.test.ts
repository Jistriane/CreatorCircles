import request from 'supertest';
import app from '../index';

describe('GET /api/purchases', () => {
  it('deve retornar histórico de compras', async () => {
    const res = await request(app)
      .get('/api/purchases?userId=user123');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 20000);
});
