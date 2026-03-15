import { ILogger } from './logger.interface';
import { GCPLogger } from './gcp-logger';

/**
 * Console-based logger for development environment.
 */
class ConsoleLogger implements ILogger {
    debug(message: string, meta?: unknown): void {
        if (meta !== undefined) {
            console.debug(`[DEBUG] ${message}`, meta);
        } else {
            console.debug(`[DEBUG] ${message}`);
        }
    }

    log(message: string, meta?: unknown): void {
        if (meta !== undefined) {
            console.log(`[INFO] ${message}`, meta);
        } else {
            console.log(`[INFO] ${message}`);
        }
    }

    warn(message: string, meta?: unknown): void {
        if (meta !== undefined) {
            console.warn(`[WARN] ${message}`, meta);
        } else {
            console.warn(`[WARN] ${message}`);
        }
    }

    error(message: string, meta?: unknown): void {
        if (meta !== undefined) {
            console.error(`[ERROR] ${message}`, meta);
        } else {
            console.error(`[ERROR] ${message}`);
        }
    }
}

/**
 * Singleton Logger Service.
 * Automatically selects the appropriate logger based on NODE_ENV.
 * - development: ConsoleLogger
 * - production: GCPLogger
 */
class LoggerService implements ILogger {
    private static instance: LoggerService;
    private logger: ILogger;

    private constructor() {
        const env = process.env.NODE_ENV || 'development';

        if (env === 'production') {
            this.logger = new GCPLogger();
        } else {
            this.logger = new ConsoleLogger();
        }
    }

    /**
     * Get the singleton instance of the LoggerService.
     */
    public static getInstance(): LoggerService {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }

    debug(message: string, meta?: unknown): void {
        this.logger.debug(message, meta);
    }

    log(message: string, meta?: unknown): void {
        this.logger.log(message, meta);
    }

    warn(message: string, meta?: unknown): void {
        this.logger.warn(message, meta);
    }

    error(message: string, meta?: unknown): void {
        this.logger.error(message, meta);
    }
}

// Export singleton instance
export const logger = LoggerService.getInstance();

// Export types for extensibility
export { ILogger } from './logger.interface';
