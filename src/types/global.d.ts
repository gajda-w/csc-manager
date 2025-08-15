/// <reference lib="dom" />

declare global {
  interface JsonWebKeySet {
    keys: JsonWebKey[];
  }

  // vite does not support runtime envs.
  var env: {
    BASE_PATH: string;
  };
}

declare module "*.gql";
declare module "*.graphql";

export {};
