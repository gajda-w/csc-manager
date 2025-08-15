// deno-lint-ignore no-explicit-any
type ErrorConstructor<T = Error> = new (...args: any[]) => T;

export function isError<T extends Error>(
  error: unknown,
  errorClass: ErrorConstructor<T>,
): error is T;

export function isError<T extends Error>(
  error: unknown,
  errorClass: ErrorConstructor<T>[],
): error is T;

export function isError<T extends Error>(
  error: unknown,
  errorClass: ErrorConstructor<T> | ErrorConstructor<T>[],
): error is T {
  if (!(error instanceof Error)) {
    return false;
  }

  return Array.isArray(errorClass)
    ? errorClass.some((ErrorClass) => error instanceof ErrorClass)
    : error instanceof errorClass;
}

export function expectError<T extends Error>(
  error: unknown,
  errorClass: ErrorConstructor<T>,
): error is T;

export function expectError<T extends Error>(
  error: unknown,
  errorClass: ErrorConstructor<T>[],
): error is T;

export function expectError<T extends Error>(
  error: unknown,
  errorClass: ErrorConstructor<T> | ErrorConstructor<T>[],
): error is T {
  const isMatch = Array.isArray(errorClass)
    ? isError(error, errorClass)
    : isError(error, errorClass);

  if (!isMatch) {
    throw error;
  }

  return true;
}
