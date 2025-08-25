/**
 * Error Logging and Debugging Utility
 *
 * Centralized error logging system for markdown rendering and other application errors
 * Requirements: 2.1, 4.2 - Error logging and debugging functionality
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByLevel: Record<LogLevel, number>;
  recentErrors: LogEntry[];
  errorRate: number; // errors per minute
}

/**
 * Error Logger Class
 */
export class ErrorLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  private isProduction: boolean;
  private sessionId: string;

  constructor(maxLogs = 1000) {
    this.maxLogs = maxLogs;
    this.isProduction = process.env.NODE_ENV === "production";
    this.sessionId = this.generateSessionId();
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning
   */
  warn(
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Log an error
   */
  error(
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log a critical error
   */
  critical(
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log(LogLevel.CRITICAL, message, context, error);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
      sessionId: this.sessionId,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    // Add to internal log storage
    this.addLogEntry(entry);

    // Console output (always in development, limited in production)
    if (
      !this.isProduction ||
      level === LogLevel.ERROR ||
      level === LogLevel.CRITICAL
    ) {
      this.outputToConsole(entry);
    }

    // Send to external services in production
    if (
      this.isProduction &&
      (level === LogLevel.ERROR || level === LogLevel.CRITICAL)
    ) {
      this.sendToExternalService(entry);
    }
  }

  /**
   * Add log entry to internal storage
   */
  private addLogEntry(entry: LogEntry): void {
    this.logs.push(entry);

    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Output log entry to console
   */
  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.sessionId}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${entry.message}`, entry.context);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${entry.message}`, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${entry.message}`, entry.context, entry.error);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(`${prefix} ${entry.message}`, entry.context, entry.error);
        if (entry.error?.stack) {
          console.error("Stack trace:", entry.error.stack);
        }
        break;
    }
  }

  /**
   * Send log entry to external monitoring service
   */
  private sendToExternalService(entry: LogEntry): void {
    // Implement your external logging service integration here
    // Examples: Sentry, LogRocket, DataDog, CloudWatch, etc.

    try {
      // Example implementation for a generic logging service
      if (typeof fetch !== "undefined") {
        fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level: entry.level,
            message: entry.message,
            timestamp: entry.timestamp.toISOString(),
            context: entry.context,
            error: entry.error
              ? {
                  name: entry.error.name,
                  message: entry.error.message,
                  stack: entry.error.stack,
                }
              : undefined,
            sessionId: entry.sessionId,
            url: entry.url,
            userAgent: entry.userAgent,
          }),
        }).catch((err) => {
          console.error("Failed to send log to external service:", err);
        });
      }
    } catch (error) {
      console.error("Error sending log to external service:", error);
    }
  }

  /**
   * Get error metrics and statistics
   */
  getMetrics(): ErrorMetrics {
    const now = Date.now();
    const oneMinuteAgo = now - 60000; // 1 minute in milliseconds

    const recentErrors = this.logs.filter(
      (log) =>
        log.timestamp.getTime() > oneMinuteAgo &&
        (log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL)
    );

    const errorsByType: Record<string, number> = {};
    const errorsByLevel: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.CRITICAL]: 0,
    };

    this.logs.forEach((log) => {
      // Count by level
      errorsByLevel[log.level]++;

      // Count by error type (if available)
      if (log.error) {
        const errorType = log.error.name || "UnknownError";
        errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
      }
    });

    return {
      totalErrors:
        errorsByLevel[LogLevel.ERROR] + errorsByLevel[LogLevel.CRITICAL],
      errorsByType,
      errorsByLevel,
      recentErrors: recentErrors.slice(-10), // Last 10 recent errors
      errorRate: recentErrors.length, // errors per minute
    };
  }

  /**
   * Get all logs with optional filtering
   */
  getLogs(filter?: {
    level?: LogLevel;
    since?: Date;
    limit?: number;
  }): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (filter?.level) {
      filteredLogs = filteredLogs.filter((log) => log.level === filter.level);
    }

    if (filter?.since) {
      filteredLogs = filteredLogs.filter(
        (log) => log.timestamp >= filter.since!
      );
    }

    if (filter?.limit) {
      filteredLogs = filteredLogs.slice(-filter.limit);
    }

    return filteredLogs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set user context for logging
   */
  setUserContext(userId: string): void {
    this.logs.forEach((log) => {
      if (!log.userId) {
        log.userId = userId;
      }
    });
  }
}

/**
 * Global error logger instance
 */
export const errorLogger = new ErrorLogger();

/**
 * Convenience functions for common logging scenarios
 */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    errorLogger.debug(message, context),

  info: (message: string, context?: Record<string, unknown>) =>
    errorLogger.info(message, context),

  warn: (message: string, context?: Record<string, unknown>, error?: Error) =>
    errorLogger.warn(message, context, error),

  error: (message: string, context?: Record<string, unknown>, error?: Error) =>
    errorLogger.error(message, context, error),

  critical: (
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ) => errorLogger.critical(message, context, error),

  // Specialized logging for markdown errors
  markdownError: (
    errorType: string,
    message: string,
    content?: string,
    error?: Error
  ) => {
    errorLogger.error(
      `Markdown Error [${errorType}]: ${message}`,
      {
        errorType,
        contentPreview:
          content?.substring(0, 200) +
          (content && content.length > 200 ? "..." : ""),
        contentLength: content?.length,
      },
      error
    );
  },

  // Performance logging
  performance: (
    operation: string,
    duration: number,
    context?: Record<string, unknown>
  ) => {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
    errorLogger.log(level, `Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...context,
    });
  },
};

/**
 * Error boundary helper for React components
 */
export const logReactError = (
  error: Error,
  errorInfo: { componentStack: string }
) => {
  errorLogger.critical(
    "React Error Boundary Triggered",
    {
      componentStack: errorInfo.componentStack,
      errorName: error.name,
      errorMessage: error.message,
    },
    error
  );
};

/**
 * Global error handler for unhandled errors
 */
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorLogger.critical(
      "Unhandled JavaScript Error",
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message,
      },
      event.error
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    errorLogger.critical("Unhandled Promise Rejection", {
      reason: event.reason,
    });
  });
}
