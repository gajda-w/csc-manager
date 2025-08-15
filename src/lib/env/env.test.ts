import { describe, expect, it, vi } from "vitest";

import { env } from "./env.ts";

const mockIsDenoRuntime = vi.hoisted(() => vi.fn());
const mockIsNodeRuntime = vi.hoisted(() => vi.fn());

vi.mock("@/constants.ts", () => ({
  IS_DENO_RUNTIME: mockIsDenoRuntime,
  IS_NODE_RUNTIME: mockIsNodeRuntime,
}));

describe("env", () => {
  describe("env", () => {
    it("env() - Returns all environment variables in Deno runtime", () => {
      // given
      const expectedObject = {
        VAR1: "value1",
        VAR2: "value2",
      };
      mockIsDenoRuntime.mockReturnValue(true);
      // @ts-expect-error if Deno runtime would be used
      vi.spyOn(Deno.env, "toObject").mockReturnValue(expectedObject);

      // when & then
      expect(env()).toMatchObject(expectedObject);
    });
  });

  it("env(name) - Returns the value of a single variable in Node runtime", () => {
    // given
    const expected1 = "value1";
    const expected2 = undefined;
    mockIsNodeRuntime.mockReturnValue(true);
    vi.stubEnv("VAR1", expected1);

    // when & then
    expect(env("VAR1")).toEqual(expected1);
    expect(env("NON_EXISTENT")).toEqual(expected2);
  });

  it("env() - Throws error in unsupported runtime", () => {
    // given
    mockIsNodeRuntime.mockReturnValue(false);
    mockIsDenoRuntime.mockReturnValue(false);

    // when & then
    expect(() => env()).toThrow(
      new Error("env() is not supported in this runtime."),
    );
  });
});
