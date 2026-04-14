import type { IHttpClient } from "../../ports/http-client";
import type { ILogger } from "../../ports/logger";
import type { VtexSession } from "./types";
import { API_PATHS } from "../../constants";

export interface SessionDeps {
  httpClient: IHttpClient;
  logger: ILogger;
}

export const getSession = async (deps: SessionDeps): Promise<VtexSession> => {
  deps.logger.debug("Getting session");
  return deps.httpClient.get<VtexSession>(API_PATHS.SESSIONS);
};

export const createSession = async (deps: SessionDeps): Promise<void> => {
  deps.logger.debug("Creating session");
  await deps.httpClient.post<void>(`${API_PATHS.SESSIONS}?forceNew=true`);
};

export const updateSession = async (
  deps: SessionDeps,
  data: Partial<VtexSession>
): Promise<VtexSession> => {
  deps.logger.debug("Updating session");
  return deps.httpClient.patch<VtexSession>(API_PATHS.SESSIONS, { body: data });
};
