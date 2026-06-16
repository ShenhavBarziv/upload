// @ts-nocheck
import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import { app, dataDir, setupRoutes, uploadDir } from '../src/routes';

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

  test('GET /api/files/:filename rejects path traversal attempts', async () => {
    const res = await request(app).get('/api/files/%2e%2e%2fpackage.json');
    expect(res.status).toBe(404);
  });

  test('GET /api/files/:filename does not follow symlinks', async () => {
    const target = path.join(os.tmpdir(), `easy-upload-secret-${Date.now()}.txt`);
    const link = path.join(dataDir, `secret-link-${Date.now()}.txt`);
    fs.writeFileSync(target, 'secret');

    try {
      fs.symlinkSync(target, link);
      const res = await request(app).get(`/api/files/${path.basename(link)}`);
      expect(res.status).toBe(404);
    } finally {
      fs.rmSync(link, { force: true });
      fs.rmSync(target, { force: true });
    }
  });

  test('GET /uploads/:filename does not follow symlinks', async () => {
    const target = path.join(os.tmpdir(), `easy-upload-secret-${Date.now()}.txt`);
    const link = path.join(uploadDir, `secret-link-${Date.now()}.txt`);
    fs.writeFileSync(target, 'secret');

    try {
      fs.symlinkSync(target, link);
      const res = await request(app).get(`/uploads/${path.basename(link)}`);
      expect(res.status).toBe(404);
    } finally {
      fs.rmSync(link, { force: true });
      fs.rmSync(target, { force: true });
    }
  });
});
