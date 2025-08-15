import { describe, expect, it } from "vitest";

import { isEmptyObject, isFunction, isObject } from "./core.ts";

describe("core", () => {
  describe("isObject", () => {
    it("should return true for plain objects", () => {
      // given
      const value = { a: 1 };
      const expected = true;

      // when
      const result = isObject(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for arrays", () => {
      // given
      const value: unknown = [1, 2, 3];
      const expected = false;

      // when
      const result = isObject(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for null", () => {
      // given
      const value = null;
      const expected = false;

      // when
      const result = isObject(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for primitive values", () => {
      // given
      const value = 42;
      const expected = false;

      // when
      const result = isObject(value);

      // then
      expect(result).toBe(expected);
    });
  });

  describe("isEmptyObject", () => {
    it("should return true for empty objects", () => {
      // given
      const value = {};
      const expected = true;

      // when
      const result = isEmptyObject(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for objects with properties", () => {
      // given
      const value = { key: "value" };
      const expected = false;

      // when
      const result = isEmptyObject(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for non-objects", () => {
      // given
      const value = "not an object";
      const expected = false;

      // when
      const result = isEmptyObject(value);

      // then
      expect(result).toBe(expected);
    });
  });

  describe("isFunction", () => {
    it("should return true for regular functions", () => {
      // given
      const value = function () {};
      const expected = true;

      // when
      const result = isFunction(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return true for arrow functions", () => {
      // given
      const value = () => {};
      const expected = true;

      // when
      const result = isFunction(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for non-function values", () => {
      // given
      const value = 123;
      const expected = false;

      // when
      const result = isFunction(value);

      // then
      expect(result).toBe(expected);
    });

    it("should return false for null", () => {
      // given
      const value = null;
      const expected = false;

      // when
      const result = isFunction(value);

      // then
      expect(result).toBe(expected);
    });
  });
});
