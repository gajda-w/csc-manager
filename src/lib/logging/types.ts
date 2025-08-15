export const LOG_LEVELS = ["info", "debug", "error", "warn"] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogMethod {
  (message: string, extra?: Record<string, unknown>): void;
}

export type LoggingMetadata = Record<string, string | number | boolean>;

export type LoggingProviderFactory = (opts: {
  level: LogLevel;
  pretty?: boolean;
  redactKeys?: RegExp[];
  metadata?: LoggingMetadata;
}) => Record<LogLevel, LogMethod>;

export type LoggingProvider = ReturnType<LoggingProviderFactory>;
