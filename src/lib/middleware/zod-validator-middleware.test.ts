// test/zodValidatorMiddleware.test.ts
import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createRequest } from "@/lib/test/request.ts";
import { ValidationError } from "../error/base.ts";
import { expectError } from "../error/helpers.ts";
import { MagicMock } from "../test/mock.ts";
import { zodValidatorMiddleware } from "./zod-validator-middleware.ts";

const createTestApp = () => {
  const app = new Hono();

  app.post(
    "/test",
    zodValidatorMiddleware("json", z.object({ foo: z.string() })),
    (c) => {
      const body = c.req.valid("json");
      return c.json({ foo: body.foo });
    },
  );

  return app;
};

describe("zodValidatorMiddleware", () => {
  it("should return 200 with valid request body", async () => {
    // given
    const app = createTestApp();
    const expectedResponse = { foo: "bar" };

    // when
    const response = await app.request(
      createRequest("/test", {
        method: "POST",
        body: JSON.stringify(expectedResponse),
        headers: { "Content-Type": "application/json" },
      }),
    );
    const json = await response.json();

    // then
    expect(response.status).toBe(200);
    expect(json).toEqual(expectedResponse);
  });

  it("should throw ValidationError for invalid json", async () => {
    // given
    const schema = z.object({ foo: z.string() });
    const middleware = zodValidatorMiddleware("json", schema);
    const expectedError = {
      detail: "Validation error",
      errors: [
        {
          code: "INVALID_TYPE",
          context: "json",
          message: "Invalid input: expected string, received undefined",
          path: "foo",
        },
      ],
      statusCode: 400,
    };

    // when & then
    try {
      await middleware(MagicMock({ req: { header: vi.fn() } }), vi.fn());
    } catch (error) {
      if (expectError(error, ValidationError)) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.serialize()).toStrictEqual(expectedError);
      }
    }
  });

  it("should throw ValidationError for invalid header", async () => {
    // given
    const schema = z.object({ foo: z.string() });
    const middleware = zodValidatorMiddleware("header", schema);
    const expectedError = {
      detail: "Validation error",
      errors: [
        {
          code: "INVALID_TYPE",
          context: "header",
          message: "Invalid input: expected string, received undefined",
          path: "foo",
        },
      ],
      statusCode: 400,
    };

    // when & then
    try {
      await middleware(
        MagicMock({
          req: { header: vi.fn(() => ({ get: vi.fn(() => undefined) })) },
        }),
        vi.fn(),
      );
    } catch (error) {
      if (expectError(error, ValidationError)) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.serialize()).toStrictEqual(expectedError);
      }
    }
  });
});
