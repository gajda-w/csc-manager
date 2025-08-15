export type Parameter<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any) => any,
  I extends number = 0,
> // deno-lint-ignore no-explicit-any
 = T extends (...args: infer P) => any ? P[I] : never;

export type Maybe<T> = T | null | undefined;

export type PartialBy<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  & Pick<
    T,
    Exclude<keyof T, Keys>
  >
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type ValueOf<T> = T[keyof T];
