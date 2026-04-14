import type { VtexConfig, ClientOptions } from "./types";
import { ConsoleLogger } from "./adapters/console-logger";
import { FetchClient } from "./adapters/fetch-client";
import { createSession } from "./features/session";
import { createCheckout } from "./features/checkout";

export type { VtexConfig, ClientOptions } from "./types";

export const createClient = (config: VtexConfig, options?: ClientOptions) => {
  const logger = options?.logger ?? new ConsoleLogger();
  const httpClient = options?.httpClient ?? new FetchClient(config);

  const deps = { httpClient, logger };

  return {
    session: createSession(deps),
    checkout: createCheckout(deps),
  };
};