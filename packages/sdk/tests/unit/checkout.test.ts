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

  describe("getProducts", () => {
    it("should GET the product search endpoint", async () => {
      httpClient.mockResponse(API_PATHS.PRODUCT_SEARCH, { products: [] });
      await checkout.getProducts();
      expect(httpClient.calls[0].method).toBe("GET");
      expect(httpClient.calls[0].path).toBe(API_PATHS.PRODUCT_SEARCH);
    });
  });

  describe("addItem", () => {
    it("should POST items to the order form and return updated order form", async () => {
      const items = [{ id: "123", quantity: 1, seller: "1" }];
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

  describe("setShipping", () => {
    it("should POST shippingData attachment", async () => {
      const shippingData = {
        clearAddressIfPostalCodeNotFound: false,
        logisticsInfo: { itemIndex: 0, selectedDeliveryChannel: "delivery", selectedSla: "normal" },
        selectedAddresses: [{
          addressName: "home",
          addressType: "residential",
          city: "Quito",
          country: "ECU",
          geoCoordinates: [-78.4678, -0.1807],
          number: "123",
          receiverName: "Test User",
          street: "Av. Test",
        }],
      };
      httpClient.mockResponse(
        `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/attachments/shippingData`,
        mockOrderForm
      );
      await checkout.setShipping(ORDER_FORM_ID, shippingData);
      expect(httpClient.calls[0].method).toBe("POST");
      expect(httpClient.calls[0].options?.body).toEqual(shippingData);
    });
  });

  describe("setClientProfile", () => {
    it("should POST clientProfileData attachment", async () => {
      const profileData = {
        document: "0000000000",
        documentType: "cedula",
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        homePhone: "+5930000000000",
      };
      httpClient.mockResponse(
        `${API_PATHS.ORDER_FORM}/${ORDER_FORM_ID}/attachments/clientProfileData`,
        mockOrderForm
      );
      await checkout.setClientProfile(ORDER_FORM_ID, profileData);
      expect(httpClient.calls[0].method).toBe("POST");
      expect(httpClient.calls[0].options?.body).toEqual(profileData);
    });
  });
});
