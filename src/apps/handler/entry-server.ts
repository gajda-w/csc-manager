import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { requestId } from 'hono/request-id';

import { clientEntryPoint } from '@/lib/client/mount.ts';
import { errorHandler } from '@/lib/error/handler.ts';
import { nodeAssetsMiddleware } from '@/lib/middleware/assets-middleware.ts';
import { healthCheckMiddleware } from '@/lib/middleware/health-check-middleware.ts';
import { loggingMiddleware } from '@/lib/middleware/logging-middleware.ts';
import { publicFilesMiddleware } from '@/lib/middleware/public-files-middleware.ts';
import { requestOriginMiddleware } from '@/lib/middleware/request-origin-middleware.ts';
import { getLogger } from '@/providers/logging.ts';
import { routes as graphqlRoutes } from './api/graphql/index.ts';
import { APP_CONFIG } from './config.ts';

const app = new Hono()
  .onError(errorHandler)
  .use(requestId())
  .use(loggingMiddleware(getLogger({ service: APP_CONFIG.SERVICE })))
  .use(nodeAssetsMiddleware())
  .use(publicFilesMiddleware())
  .use(requestOriginMiddleware())
  .use(healthCheckMiddleware())
  /**
   *  Nested rutes must be defined at the end for proper type inference for hono/client.
   */
  .route('/api/graphql', graphqlRoutes)
  .basePath(APP_CONFIG.BASE_PATH);

export type AppType = typeof app;

app.get('/client/*', (context) =>
  clientEntryPoint({
    context,
    basepath: APP_CONFIG.BASE_PATH,
    meta: import.meta,
  })
);

const handler = handle(app);

export { app, handler };
