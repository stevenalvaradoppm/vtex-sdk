import { describe, it, expect } from "vitest";
import { createClient } from "../../src/client";
import { MockHttpClient } from "../mocks/http-client.mock";
import { ConsoleLogger } from "../../src/adapters/console-logger";

const config = {
  baseUrl: "https://mystore.vtexcommercestable.com.br",
  appKey: "vtexappkey-test",
  appToken: "vtexapptoken-test",
};

describe("createClient", () => {
  it("should return session and checkout features", () => {
    const client = createClient(config);
    expect(client).toHaveProperty("session");
    expect(client).toHaveProperty("checkout");
  });

  it("should expose session methods", () => {
    const client = createClient(config);
    expect(typeof client.session.getSession).toBe("function");
    expect(typeof client.session.createSession).toBe("function");
    expect(typeof client.session.updateSession).toBe("function");
  });

  it("should expose checkout methods", () => {
    const client = createClient(config);
    expect(typeof client.checkout.getOrderForm).toBe("function");
    expect(typeof client.checkout.createOrderForm).toBe("function");
    expect(typeof client.checkout.addItem).toBe("function");
    expect(typeof client.checkout.removeItem).toBe("function");
    expect(typeof client.checkout.updateItems).toBe("function");
    expect(typeof client.checkout.setShipping).toBe("function");
    expect(typeof client.checkout.setPayment).toBe("function");
    expect(typeof client.checkout.setClientProfile).toBe("function");
    expect(typeof client.checkout.placeOrder).toBe("function");
    expect(typeof client.checkout.getInstallments).toBe("function");
    expect(typeof client.checkout.addCoupon).toBe("function");
    expect(typeof client.checkout.removeCoupon).toBe("function");
  });

  it("should accept custom adapters via options", () => {
    const httpClient = new MockHttpClient();
    const logger = new ConsoleLogger();

    const client = createClient(config, { httpClient, logger });
    expect(client).toHaveProperty("session");
    expect(client).toHaveProperty("checkout");
  });
});
