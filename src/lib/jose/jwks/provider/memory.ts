import { createRemoteJWKSet } from "jose";

import NodeCache from "@cacheable/node-cache";
import { JWKSFetchError } from "../../error.ts";
import type { JWKSProvider, JWKSProviderFactory } from "./types.ts";

const CACHE = new NodeCache({
  stdTTL: 60 * 60 * 24 * 30,
});

export const jwksMemoryProvider: JWKSProviderFactory = ({
  logger,
  remoteUrl,
}) => {
  const __origin = new URL(remoteUrl).origin;
  const __remoteJWKS = createRemoteJWKSet(
    new URL(`${__origin}/.well-known/jwks.json`),
  );

  const set: JWKSProvider["set"] = ({ issuer, jwks }) => {
    CACHE.set(issuer, jwks);
  };

  const get: JWKSProvider["get"] = async (
    { issuer, forceRefresh = false },
  ): Promise<JsonWebKeySet> => {
    let jwks = CACHE.get(issuer) as JsonWebKeySet | undefined;

    if (!jwks || forceRefresh) {
      logger?.info("Fetching JWKS.", {
        forceRefresh,
        issuer,
      });

      await __remoteJWKS.reload();

      const remoteJwks = __remoteJWKS.jwks();

      if (!remoteJwks) {
        throw new JWKSFetchError({
          message: `Failed to fetch JWKS from ${remoteUrl}.`,
        });
      }

      // Ensure the jwks object has the correct structure
      jwks = remoteJwks as JsonWebKeySet;

      set({ issuer, jwks });
    }

    return jwks;
  };

  return {
    set,
    get,
  };
};
