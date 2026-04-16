import {
  createSession as createSessionUseCase,
  type SessionDeps,
} from "./session";

export type { CreateSessionInput } from "./types";
export type { SessionDeps };

export const createSession = (deps: SessionDeps) => ({
  createSession: (email?: string): Promise<void> => createSessionUseCase(deps, email),
});

export type SessionFeature = ReturnType<typeof createSession>;
