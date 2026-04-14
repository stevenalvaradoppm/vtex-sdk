import { describe, it, expect, beforeEach } from "vitest";
import { createSession } from "../../src/features/session";
import { MockHttpClient } from "../mocks/http-client.mock";
import { ConsoleLogger } from "../../src/adapters/console-logger";
import { mockSession } from "../mocks/vtex-responses.mock";
import { API_PATHS } from "../../src/constants";

const makeLogger = () => new ConsoleLogger();

describe("session feature", () => {
  let httpClient: MockHttpClient;
  let session: ReturnType<typeof createSession>;

  beforeEach(() => {
    httpClient = new MockHttpClient();
    session = createSession({ httpClient, logger: makeLogger() });
  });

  describe("createSession", () => {
    it("should POST to sessions endpoint with forceNew", async () => {
      httpClient.mockResponse(`${API_PATHS.SESSIONS}?forceNew=true`, undefined);
      await session.createSession();
      const call = httpClient.calls[0];
      expect(call.method).toBe("POST");
      expect(call.path).toBe(`${API_PATHS.SESSIONS}?forceNew=true`);
    });
  });

  describe("getSession", () => {
    it("should GET the session and return it", async () => {
      httpClient.mockResponse(API_PATHS.SESSIONS, mockSession);
      const result = await session.getSession();
      expect(result).toEqual(mockSession);
      expect(httpClient.calls[0].method).toBe("GET");
    });
  });

  describe("updateSession", () => {
    it("should PATCH the session with new data", async () => {
      const updated = { ...mockSession, id: "updated-id" };
      httpClient.mockResponse(API_PATHS.SESSIONS, updated);
      const result = await session.updateSession({ id: "updated-id" });
      expect(result.id).toBe("updated-id");
      expect(httpClient.calls[0].method).toBe("PATCH");
    });
  });
});
