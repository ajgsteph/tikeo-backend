import { Logging, Log, Entry } from '@google-cloud/logging';
import { ILogger, LogLevel } from './logger.interface';


export class GCPLogger implements ILogger {
    private logging: Logging;
    private gcpLog: Log;
    private serviceName: string;
    private environment: string;

    constructor() {
        this.logging = new Logging();
        this.gcpLog = this.logging.log(process.env.GCP_LOG_NAME || 'app-logs');
        this.serviceName = process.env.SERVICE_NAME || 'tikeo-planity-backend';
        this.environment = process.env.NODE_ENV || 'production';
    }

    private async writeLog(
        level: LogLevel,
        message: string,
        meta?: unknown,
        waitForWrite = false
    ): Promise<void> {
        try {
            const severity = this.getSeverity(level);

            const entry: Entry = this.gcpLog.entry(
                {
                    resource: { type: 'global' },
                    severity,
                },
                {
                    message,
                    level,
                    timestamp: new Date().toISOString(),
                    serviceName: this.serviceName,
                    environment: this.environment,
                    meta: meta ?? null,
                },
            );
            if (waitForWrite) {

                await this.gcpLog.write(entry);
            } else {

                this.gcpLog.write(entry).catch((err) => {
                    console.error('[GCPLogger] Failed to write log to GCP:', err);
                });
            }
        } catch (err) {
            console.error('[GCPLogger] Error creating log entry:', err);
        }
    }

    private getSeverity(level: LogLevel): string {
        switch (level) {
            case 'debug':
                return 'DEBUG';
            case 'warn':
                return 'WARNING';
            case 'error':
                return 'ERROR';
            case 'info':
            default:
                return 'INFO';
        }
    }

    debug(message: string, meta?: unknown): void {
        this.writeLog('debug', message, meta);
    }
    log(message: string, meta?: unknown): void {
        this.writeLog('info', message, meta);
    }

    warn(message: string, meta?: unknown): void {
        this.writeLog('warn', message, meta);
    }

    error(message: string, meta?: unknown): void {
        this.writeLog('error', message, meta);
    }
}
