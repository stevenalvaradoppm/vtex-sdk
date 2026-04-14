import type { ILogger } from "../ports/logger";

export class ConsoleLogger implements ILogger {
  debug(message: string, ...args: unknown[]): void {
    console.debug(`[vtex-sdk:debug] ${message}`, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[vtex-sdk:info] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[vtex-sdk:warn] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[vtex-sdk:error] ${message}`, ...args);
  }
}
