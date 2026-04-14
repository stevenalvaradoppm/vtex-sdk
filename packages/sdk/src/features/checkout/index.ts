import {
  getOrderForm,
  createOrderForm,
  addItem,
  removeItem,
  updateItems,
  setShipping,
  setPayment,
  setClientProfile,
  placeOrder,
  getInstallments,
  addCoupon,
  removeCoupon,
  type CheckoutDeps,
} from "./checkout";
import type {
  OrderForm,
  AddItemInput,
  UpdateItemInput,
  ShippingData,
  PaymentData,
  ClientProfileData,
  Installment,
} from "./types";

export type {
  OrderForm,
  OrderFormItem,
  AddItemInput,
  UpdateItemInput,
  ShippingData,
  PaymentData,
  ClientProfileData,
  Totalizer,
  Installment,
  Address,
  DeliveryOption,
} from "./types";
export type { CheckoutDeps };

export const createCheckout = (deps: CheckoutDeps) => ({
  getOrderForm: (orderFormId?: string): Promise<OrderForm> =>
    getOrderForm(deps, orderFormId),
  createOrderForm: (): Promise<OrderForm> => createOrderForm(deps),
  addItem: (orderFormId: string, items: AddItemInput[]): Promise<OrderForm> =>
    addItem(deps, orderFormId, items),
  removeItem: (orderFormId: string, itemIndex: number): Promise<OrderForm> =>
    removeItem(deps, orderFormId, itemIndex),
  updateItems: (orderFormId: string, items: UpdateItemInput[]): Promise<OrderForm> =>
    updateItems(deps, orderFormId, items),
  setShipping: (orderFormId: string, shippingData: Partial<ShippingData>): Promise<OrderForm> =>
    setShipping(deps, orderFormId, shippingData),
  setPayment: (orderFormId: string, paymentData: Partial<PaymentData>): Promise<OrderForm> =>
    setPayment(deps, orderFormId, paymentData),
  setClientProfile: (orderFormId: string, profileData: Partial<ClientProfileData>): Promise<OrderForm> =>
    setClientProfile(deps, orderFormId, profileData),
  placeOrder: (orderFormId: string): Promise<unknown> =>
    placeOrder(deps, orderFormId),
  getInstallments: (orderFormId: string): Promise<Installment[]> =>
    getInstallments(deps, orderFormId),
  addCoupon: (orderFormId: string, couponCode: string): Promise<OrderForm> =>
    addCoupon(deps, orderFormId, couponCode),
  removeCoupon: (orderFormId: string): Promise<OrderForm> =>
    removeCoupon(deps, orderFormId),
});

export type CheckoutFeature = ReturnType<typeof createCheckout>;
