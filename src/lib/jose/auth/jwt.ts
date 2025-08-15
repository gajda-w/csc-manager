import { createLocalJWKSet, decodeJwt, jwtVerify } from "jose";
import { JWTInvalid } from "jose/errors";

import type { JWKSProvider } from "../jwks/provider/types.ts";

export const verifyJWT = async ({
  jwt,
  jwksPrvider,
  forceRefresh = false,
}: {
  forceRefresh?: boolean;
  jwksPrvider: JWKSProvider;
  jwt: string;
}): Promise<void> => {
  const unverifiedPayload = decodeJwt(jwt);
  const jwks = await jwksPrvider.get({
    issuer: unverifiedPayload["iss"] ?? "",
    forceRefresh,
  });
  const cryptoKeu = createLocalJWKSet(jwks);

  try {
    await jwtVerify(jwt, cryptoKeu);
  } catch (err) {
    if (err instanceof JWTInvalid && !forceRefresh) {
      return await verifyJWT({
        jwt,
        jwksPrvider,
        forceRefresh: true,
      });
    }

    throw err;
  }
};
