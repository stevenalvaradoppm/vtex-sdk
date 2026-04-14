import type { VtexSession } from "../../src/features/session/types";
import type { OrderForm } from "../../src/features/checkout/types";

export const mockSession: VtexSession = {
  id: "mock-session-id",
  namespaces: {
    profile: {
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      isAuthenticated: false,
    },
    store: {
      channel: { value: "1" },
      countryCode: { value: "BRA" },
      cultureInfo: { value: "pt-BR" },
      currencyCode: { value: "BRL" },
      currencySymbol: { value: "R$" },
    },
  },
};

export const mockOrderForm: OrderForm = {
  orderFormId: "mock-order-form-id",
  items: [],
  totalizers: [],
  shippingData: null,
  paymentData: {
    installmentOptions: [],
    paymentSystems: [],
    payments: [],
    giftCards: [],
  },
  clientProfileData: null,
  value: 0,
  status: "orderFormProvider",
  canEditData: true,
  loggedIn: false,
  isCheckedIn: false,
};

export const mockOrderFormWithItem: OrderForm = {
  ...mockOrderForm,
  items: [
    {
      id: "123",
      name: "Test Product",
      detailUrl: "/test-product/p",
      imageUrl: "https://example.com/image.jpg",
      skuName: "Test SKU",
      quantity: 1,
      uniqueId: "unique-123",
      productId: "product-123",
      refId: "ref-123",
      ean: "1234567890123",
      priceValidUntil: "2026-01-01T00:00:00Z",
      price: 10000,
      tax: 0,
      listPrice: 12000,
      sellingPrice: 10000,
      rewardValue: 0,
      isGift: false,
      parentItemIndex: null,
      parentAssemblyBinding: null,
    },
  ],
  totalizers: [{ id: "Items", name: "Items total", value: 10000 }],
  value: 10000,
};
