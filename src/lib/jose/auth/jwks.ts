import { createLocalJWKSet, flattenedVerify } from "jose";
import { JWTInvalid } from "jose/errors";
import type { Buffer } from "node:buffer";

import { JWKSInvalidError } from "../error.ts";
import type { JWKSProvider } from "../jwks/provider/types.ts";

/**
 * @param payload - Raw request body.
 * @param jws - Saleor-Signature header.
 * @param issuer - Saleor-Api-Url header.
 * @param jwksProvider
 * @param forceRefresh - If JWKS should be refreshed upon failure.
 */
export const verifyJWKS = async ({
  payload,
  jws,
  issuer,
  jwksProvider,
  forceRefresh = false,
}: {
  forceRefresh?: boolean;
  issuer: string;
  jwksProvider: JWKSProvider;
  jws: string;
  payload: Buffer | string | undefined;
}): Promise<void> => {
  const [protectedHeader, signature] = jws.split("..") ?? [];
  const jwks = await jwksProvider.get({
    issuer,
    forceRefresh,
  });
  const cryptoKey = createLocalJWKSet(jwks);

  try {
    await flattenedVerify(
      {
        protected: protectedHeader,
        payload: payload ?? "",
        signature,
      },
      cryptoKey,
    );
  } catch (err) {
    if (err instanceof JWTInvalid && !forceRefresh) {
      return await verifyJWKS({
        payload,
        jws,
        issuer,
        jwksProvider,
        forceRefresh: true,
      });
    }

    throw new JWKSInvalidError({ cause: err });
  }
};
