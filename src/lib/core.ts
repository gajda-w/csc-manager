export const isObject = (obj: unknown): obj is object =>
  obj?.constructor.name === "Object";

export const isEmptyObject = (obj: unknown) =>
  isObject(obj) && Object.keys(obj).length === 0;

export const isFunction = (
  value: unknown,
  // deno-lint-ignore no-explicit-any
): value is (...args: any[]) => any => {
  return typeof value === "function";
};
