import { isValidUrl } from "@/lib/http.ts";

type Input = ConstructorParameters<typeof Request>[0];
type Init = ConstructorParameters<typeof Request>[1];

/**
 * Heleper fn for creating request object.
 * app.request has bad types because @smithy overrides globalThis.RequestInit, and
 * we cannot simply do 'app.requjest('/', { method: "POST" })`
 */
export const createRequest = (input: Input, init?: Init) => {
  if (typeof input === "string" && !isValidUrl(input)) {
    input = new URL(input, "http://localhost");
  }

  return new Request(input, init);
};
