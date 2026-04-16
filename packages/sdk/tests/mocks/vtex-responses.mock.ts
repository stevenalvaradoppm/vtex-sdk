import type { OrderForm } from "../../src/features/checkout/types";

export const mockOrderForm: OrderForm = {
  orderFormId: "mock-order-form-id",
  items: [],
  value: 0,
  status: "orderFormProvider",
};

export const mockOrderFormWithItem: OrderForm = {
  ...mockOrderForm,
  items: [
    {
      id: "123",
      name: "Test Product",
      imageUrl: "https://example.com/image.jpg",
      skuName: "Test SKU",
      quantity: 1,
      uniqueId: "unique-123",
      price: 10000,
      listPrice: 12000,
      sellingPrice: 10000,
    },
  ],
  value: 10000,
};
