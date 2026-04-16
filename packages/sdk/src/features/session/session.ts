import type { IHttpClient } from "../../ports/http-client";
import type { ILogger } from "../../ports/logger";
import type { CreateSessionInput } from "./types";
import { API_PATHS } from "../../constants";

export interface SessionDeps {
  httpClient: IHttpClient;
  logger: ILogger;
}

export const createSession = async (
  deps: SessionDeps,
  email?: string
): Promise<void> => {
  deps.logger.debug("Creating session");
  const body: CreateSessionInput = email
    ? { public: { storeUserEmail: { value: email } } }
    : {};
  await deps.httpClient.post<void>(`${API_PATHS.SESSIONS}?forceNew=true`, { body });
};
