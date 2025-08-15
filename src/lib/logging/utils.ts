import traverse from "neotraverse";

import { REDACT_MASK } from "./constants.ts";

export function redact<T extends Record<string | symbol, unknown>>({
  source,
  keys,
}: {
  source: T;
  keys: RegExp[];
}): T {
  const isSensitiveKey = (key: PropertyKey) =>
    keys.some((regex) => regex.test(key as string));
  const copy = JSON.parse(JSON.stringify(source));

  traverse(copy).forEach(function (value) {
    if (this.key && value && typeof value === "string") {
      if (isSensitiveKey(this.key)) {
        this.update(REDACT_MASK);
      }
    }
  });

  return copy as T;
}

export const dateToTime = (date: Date) => {
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
