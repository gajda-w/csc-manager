import { createConsola, type LogType } from "consola";
import { colorize, type ColorName } from "consola/utils";
import process from "node:process";

import type { ValueOf } from "@/lib/types.ts";
import { isEmptyObject } from "../../core.ts";
import type {
  LoggingMetadata,
  LoggingProviderFactory,
  LogMethod,
} from "../types.ts";
import { dateToTime, redact } from "../utils.ts";

const COLOR_MAP: Partial<Record<LogType, ColorName>> = {
  warn: "yellow",
  info: "green",
  error: "red",
  debug: "dim",
};
const LOG_LEVEL_MAP: Partial<Record<LogType, number>> = {
  warn: 1,
  info: 3,
  error: 0,
  debug: 4,
};

export const consolaLoggingProvider: LoggingProviderFactory = ({
  level,
  pretty,
  metadata,
  redactKeys = [],
}) => {
  const __logger = createConsola({
    formatOptions: { colors: true, compact: false, date: true, keke: "kaka" },
    level: LOG_LEVEL_MAP[level],
    reporters: [
      {
        log({ args: [message, ...args], date, type }) {
          const extra = Object.assign({}, ...args, ...[metadata]);
          const redacted = redact({ source: extra, keys: redactKeys });

          if (pretty) {
            const time = dateToTime(date);
            const logColor = COLOR_MAP[type] as ColorName;
            const startSegments: ValueOf<LoggingMetadata>[] = [
              `[${time}]`,
              `[${type.toUpperCase()}]`,
            ];

            if (redacted?.service) {
              startSegments.push(`[${redacted.service}]`);
              delete redacted.service;
            }

            const endSegments = [
              ` ${message}`,
              ...["method", "status", "path"].map((key) => {
                if (redacted?.[key]) {
                  const segment = ` ${redacted[key]}`;
                  delete redacted[key];
                  return segment;
                }
              }),
            ].filter(Boolean);

            const formattedMessage = [...startSegments, ...endSegments].join(
              "",
            );

            console.log(colorize("bold", colorize(logColor, formattedMessage)));

            if (!isEmptyObject(redacted)) {
              console.dir(redacted, { depth: null, colors: true });
            }
          } else {
            process.stdout.write(
              JSON.stringify({
                message,
                ...redacted,
                timestamp: date.toISOString(),
                type,
              }),
            );
          }
        },
      },
    ],
  });

  const error: LogMethod = (message, extra) => {
    __logger.error(message, { ...metadata, ...extra });
  };

  const info: LogMethod = (message, extra) => {
    __logger.info(message, { ...metadata, ...extra });
  };

  const warn: LogMethod = (message, extra) => {
    __logger.warn(message, { ...metadata, ...extra });
  };

  const debug: LogMethod = (message, extra) => {
    __logger.debug(message, { ...metadata, ...extra });
  };

  return {
    error,
    info,
    warn,
    debug,
  };
};
