import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "../../src/client";
import { MockHttpClient } from "../mocks/http-client.mock";
import { ConsoleLogger } from "../../src/adapters/console-logger";
import { mockOrderForm, mockOrderFormWithItem } from "../mocks/vtex-responses.mock";
import { API_PATHS } from "../../src/constants";

const config = {
  baseUrl: "https://mystore.vtexcommercestable.com.br",
  appKey: "vtexappkey-test",
  appToken: "vtexapptoken-test",
};

const ORDER_FORM_ID = "mock-order-form-id";

describe("checkout flow (integration)", () => {
  let httpClient: MockHttpClient;
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    httpClient = new MockHttpClient();
    client = createClient(config, {
      httpClient,
      logger: new ConsoleLogger(),
    });
  });

  it("should complete a full session → cart → item flow", async () => {
    httpClient.mockResponse(`${API_PATHS.SESSIONS}?forceNew=true`, undefined);
    httpClient.mockResponse(API_PATHS.ORDER_FORM, mockOrderForm);
    httpClient.mockResponse(
      `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/items`,
      mockOrderFormWithItem
    );

    await client.session.createSession();

    const orderForm = await client.checkout.createOrderForm();
    expect(orderForm.orderFormId).toBe(ORDER_FORM_ID);

    const updatedOrderForm = await client.checkout.addItem(ORDER_FORM_ID, [
      { id: "123", quantity: 1, seller: "1" },
    ]);
    expect(updatedOrderForm.items).toHaveLength(1);
    expect(updatedOrderForm.items[0].quantity).toBe(1);
  });

  it("should record the correct HTTP call sequence", async () => {
    httpClient.mockResponse(`${API_PATHS.SESSIONS}?forceNew=true`, undefined);
    httpClient.mockResponse(API_PATHS.ORDER_FORM, mockOrderForm);

    await client.session.createSession();
    await client.checkout.createOrderForm();

    expect(httpClient.calls[0].method).toBe("POST");
    expect(httpClient.calls[0].path).toBe(`${API_PATHS.SESSIONS}?forceNew=true`);
    expect(httpClient.calls[1].method).toBe("POST");
    expect(httpClient.calls[1].path).toBe(API_PATHS.ORDER_FORM);
  });
});
