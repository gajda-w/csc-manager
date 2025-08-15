import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import { createRequest } from "@/lib/test/request.ts";
import { healthCheckMiddleware } from "./health-check-middleware.ts";

const createAppWithMiddleware = (opts?: { path?: string }) => {
  const app = new Hono();
  app.use("*", healthCheckMiddleware(opts));
  app.get("/other", (c) => c.json({ message: "not healthcheck" }));
  return app;
};

describe("healthCheckMiddleware", () => {
  it("should return 200 on default /healthcheck path", async () => {
    // given
    const app = createAppWithMiddleware();

    // when
    const res = await app.request("/healthcheck");
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });

  it("should not intercept non-matching routes", async () => {
    // given
    const app = createAppWithMiddleware();

    // when
    const res = await app.request("/other");
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body).toEqual({ message: "not healthcheck" });
  });

  it("should support custom path", async () => {
    // given
    const app = createAppWithMiddleware({ path: "/ping" });

    // when
    const res = await app.request("/ping");
    const body = await res.json();

    // then
    expect(res.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });

  it("should skip if method is not GET", async () => {
    // given
    const app = new Hono();
    app.use("*", healthCheckMiddleware());
    app.post("/healthcheck", (c) => c.text("skipped"));

    // when
    const res = await app.request(
      createRequest("/healthcheck", { method: "POST" }),
    );
    const text = await res.text();

    // then
    expect(res.status).toBe(200);
    expect(text).toBe("skipped");
  });
});
