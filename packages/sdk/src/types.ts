import type { IHttpClient } from "./ports/http-client";
import type { ILogger } from "./ports/logger";

export interface VtexConfig {
  baseUrl: string;
  appKey: string;
  appToken: string;
}

export interface VtexContext {
  config: VtexConfig;
  httpClient: IHttpClient;
  logger: ILogger;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: import("./errors").SdkError };

export interface ClientOptions {
  httpClient?: IHttpClient;
  logger?: ILogger;
}
