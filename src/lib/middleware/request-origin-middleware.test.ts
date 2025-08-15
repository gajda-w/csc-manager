import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';

import { createRequest } from '@/lib/test/request.ts';
import { requestOriginMiddleware } from './request-origin-middleware.ts';

const createAppWithMiddleware = () => {
  const app = new Hono();

  app.use('*', requestOriginMiddleware());

  app.get('/origin', (c) => {
    return c.json({ origin: c.req.origin });
  });

  return app;
};

describe('requestOriginMiddleware', () => {
  it('should set origin using x-forwarded-proto and host headers', async () => {
    // given
    const app = createAppWithMiddleware();
    const expectedOrigin = 'https://example.com';

    // when
    const res = await app.request(
      createRequest('/origin', {
        headers: {
          'x-forwarded-proto': 'https',
          host: 'example.com',
        },
      })
    );
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body.origin).toBe(expectedOrigin);
  });

  it('should fallback to http and localhost if headers are missing', async () => {
    // given
    const app = createAppWithMiddleware();
    const expectedOrigin = 'http://localhost';

    // when
    const res = await app.request(createRequest('/origin'));
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body.origin).toBe(expectedOrigin);
  });

  it('should use x-forwarded-proto if only proto is provided', async () => {
    // given
    const app = createAppWithMiddleware();
    const expectedOrigin = 'https://localhost';

    // when
    createRequest;
    const res = await app.request(
      createRequest('/origin', {
        headers: { 'x-forwarded-proto': 'https' },
      })
    );
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body.origin).toBe(expectedOrigin);
  });

  it('should use host if only host is provided', async () => {
    // given
    const app = createAppWithMiddleware();
    const expectedOrigin = 'http://example.dev';

    // when
    const res = await app.request(
      createRequest('/origin', {
        headers: {
          host: 'example.dev',
        },
      })
    );
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body.origin).toBe(expectedOrigin);
  });
});
