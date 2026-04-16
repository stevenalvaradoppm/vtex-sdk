import { describe, it, expect, beforeEach } from "vitest";
import { createSession } from "../../src/features/session";
import { MockHttpClient } from "../mocks/http-client.mock";
import { ConsoleLogger } from "../../src/adapters/console-logger";
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

    it("should include email in body when provided", async () => {
      httpClient.mockResponse(`${API_PATHS.SESSIONS}?forceNew=true`, undefined);
      await session.createSession("test@example.com");
      const call = httpClient.calls[0];
      expect(call.method).toBe("POST");
      expect(call.options?.body).toEqual({
        public: { storeUserEmail: { value: "test@example.com" } },
      });
    });

    it("should send empty body when no email provided", async () => {
      httpClient.mockResponse(`${API_PATHS.SESSIONS}?forceNew=true`, undefined);
      await session.createSession();
      expect(httpClient.calls[0].options?.body).toEqual({});
    });
  });
});
