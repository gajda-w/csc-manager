import { Hono, type MiddlewareHandler } from "hono";

export const createTestApp = ({
  middlewares = [],
  path = "/",
  app,
}: {
  app: Hono;
  path?: string;
  middlewares?: MiddlewareHandler[];
}) => {
  const testApp = new Hono();
  middlewares?.forEach((middleware) => testApp.use(middleware));

  testApp.route(path, app); // mount as a sub-router
  return testApp;
};
