import {
  getSession,
  createSession as createSessionUseCase,
  updateSession,
  type SessionDeps,
} from "./session";
import type { VtexSession } from "./types";

export type { VtexSession, SessionProfile, SessionSegment } from "./types";
export type { SessionDeps };

export const createSession = (deps: SessionDeps) => ({
  getSession: (): Promise<VtexSession> => getSession(deps),
  createSession: (): Promise<void> => createSessionUseCase(deps),
  updateSession: (data: Partial<VtexSession>): Promise<VtexSession> =>
    updateSession(deps, data),
});

export type SessionFeature = ReturnType<typeof createSession>;
