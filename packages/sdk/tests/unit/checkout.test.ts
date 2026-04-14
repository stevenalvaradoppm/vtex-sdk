import { describe, it, expect, beforeEach } from "vitest";
import { createCheckout } from "../../src/features/checkout";
import { MockHttpClient } from "../mocks/http-client.mock";
import { ConsoleLogger } from "../../src/adapters/console-logger";
import { mockOrderForm, mockOrderFormWithItem } from "../mocks/vtex-responses.mock";
import { API_PATHS } from "../../src/constants";

const ORDER_FORM_ID = "mock-order-form-id";
const makeLogger = () => new ConsoleLogger();

describe("checkout feature", () => {
  let httpClient: MockHttpClient;
  let checkout: ReturnType<typeof createCheckout>;

  beforeEach(() => {
    httpClient = new MockHttpClient();
    checkout = createCheckout({ httpClient, logger: makeLogger() });
  });

  describe("createOrderForm", () => {
    it("should POST to orderForm endpoint and return an order form", async () => {
      httpClient.mockResponse(API_PATHS.ORDER_FORM, mockOrderForm);
      const result = await checkout.createOrderForm();
      expect(result).toEqual(mockOrderForm);
      expect(httpClient.calls[0].method).toBe("POST");
      expect(httpClient.calls[0].path).toBe(API_PATHS.ORDER_FORM);
    });
  });

  describe("getOrderForm", () => {
    it("should GET the order form by id", async () => {
      httpClient.mockResponse(`${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}`, mockOrderForm);
      const result = await checkout.getOrderForm(ORDER_FORM_ID);
      expect(result).toEqual(mockOrderForm);
      expect(httpClient.calls[0].method).toBe("GET");
    });

    it("should GET the base order form when no id provided", async () => {
      httpClient.mockResponse(API_PATHS.ORDER_FORM, mockOrderForm);
      const result = await checkout.getOrderForm();
      expect(result).toEqual(mockOrderForm);
      expect(httpClient.calls[0].path).toBe(API_PATHS.ORDER_FORM);
    });
  });

  describe("addItem", () => {
    it("should POST items to the order form and return updated order form", async () => {
      const items = [{ id: 123, quantity: 1, seller: "1" }];
      httpClient.mockResponse(
        `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/items`,
        mockOrderFormWithItem
      );
      const result = await checkout.addItem(ORDER_FORM_ID, items);
      expect(result.items).toHaveLength(1);
      expect(httpClient.calls[0].method).toBe("POST");
      expect(httpClient.calls[0].options?.body).toEqual({ orderItems: items });
    });
  });

  describe("removeItem", () => {
    it("should DELETE item by index from order form", async () => {
      httpClient.mockResponse(
        `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/items/0`,
        mockOrderForm
      );
      const result = await checkout.removeItem(ORDER_FORM_ID, 0);
      expect(result).toEqual(mockOrderForm);
      expect(httpClient.calls[0].method).toBe("DELETE");
    });
  });

  describe("addCoupon", () => {
    it("should POST coupon code to order form", async () => {
      httpClient.mockResponse(
        `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/coupons`,
        mockOrderForm
      );
      await checkout.addCoupon(ORDER_FORM_ID, "DISCOUNT10");
      expect(httpClient.calls[0].method).toBe("POST");
      expect(httpClient.calls[0].options?.body).toEqual({ text: "DISCOUNT10" });
    });
  });

  describe("removeCoupon", () => {
    it("should DELETE coupon from order form", async () => {
      httpClient.mockResponse(
        `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/coupons`,
        mockOrderForm
      );
      await checkout.removeCoupon(ORDER_FORM_ID);
      expect(httpClient.calls[0].method).toBe("DELETE");
    });
  });
});
