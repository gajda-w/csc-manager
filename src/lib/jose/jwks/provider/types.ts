import type { LoggingProvider } from "@/lib/logging/types.ts";

export type JWKSProviderFactoryOpts = {
  remoteUrl: string;
  logger?: LoggingProvider;
};

export type JWKSProviderFactory = (opts: JWKSProviderFactoryOpts) => {
  get: (opts: {
    forceRefresh?: boolean;
    issuer: string;
  }) => Promise<JsonWebKeySet>;
  set: (opts: { issuer: string; jwks: JsonWebKeySet }) => void;
};

export type JWKSProvider = ReturnType<JWKSProviderFactory>;
