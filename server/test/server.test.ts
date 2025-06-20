// @ts-nocheck
import request from 'supertest';
import { app, setupRoutes } from '../src/routes';

beforeAll(() => {
  setupRoutes();
});

describe('API routes', () => {
  test('GET /api/uploads returns array', async () => {
    const res = await request(app).get('/api/uploads');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/downloads returns array', async () => {
    const res = await request(app).get('/api/downloads');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
