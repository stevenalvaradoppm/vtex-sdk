import {
  createOrderForm,
  getProducts,
  addItem,
  setShipping,
  setClientProfile,
  type CheckoutDeps,
} from "./checkout";
import type {
  OrderForm,
  AddItemInput,
  ShippingDataInput,
  ClientProfileDataInput,
} from "./types";

export type {
  OrderForm,
  OrderFormItem,
  AddItemInput,
  ShippingDataInput,
  ClientProfileDataInput,
  LogisticsInfo,
  SelectedAddress,
} from "./types";
export type { CheckoutDeps };

export const createCheckout = (deps: CheckoutDeps) => ({
  createOrderForm: (): Promise<OrderForm> => createOrderForm(deps),
  getProducts: (): Promise<unknown> => getProducts(deps),
  addItem: (orderFormId: string, items: AddItemInput[]): Promise<OrderForm> =>
    addItem(deps, orderFormId, items),
  setShipping: (orderFormId: string, shippingData: ShippingDataInput): Promise<OrderForm> =>
    setShipping(deps, orderFormId, shippingData),
  setClientProfile: (orderFormId: string, profileData: ClientProfileDataInput): Promise<OrderForm> =>
    setClientProfile(deps, orderFormId, profileData),
});

export type CheckoutFeature = ReturnType<typeof createCheckout>;
