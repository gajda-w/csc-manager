import { type HttpErrorOptions, UnauthorizedError } from "@/lib/error/base.ts";

export class JOSEInvalidError extends UnauthorizedError {}

export class JWTInvalidError extends JOSEInvalidError {}

export class JWKSInvalidError extends JOSEInvalidError {}

export class JWKSFetchError extends JOSEInvalidError {
  constructor(options?: HttpErrorOptions) {
    super({ message: "Failed to fetch JWKS.", ...options });
  }
}
