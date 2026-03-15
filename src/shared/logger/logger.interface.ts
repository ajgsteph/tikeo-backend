/**
 * Logger interface for abstraction.
 * Allows swapping implementations (Console, GCP, Sentry, Datadog, etc.)
 */
export interface ILogger {
    log(message: string, meta?: unknown): void;
    warn(message: string, meta?: unknown): void;
    error(message: string, meta?: unknown): void;
    debug(message: string, meta?: unknown): void;
}

/**
 * Log levels supported by the logger.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
