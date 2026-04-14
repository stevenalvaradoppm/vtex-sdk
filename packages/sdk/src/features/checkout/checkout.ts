import type { IHttpClient } from "../../ports/http-client";
import type { ILogger } from "../../ports/logger";
import type {
  OrderForm,
  AddItemInput,
  UpdateItemInput,
  ShippingData,
  PaymentData,
  ClientProfileData,
  Installment,
} from "./types";
import { API_PATHS } from "../../constants";

export interface CheckoutDeps {
  httpClient: IHttpClient;
  logger: ILogger;
}

export const getOrderForm = async (
  deps: CheckoutDeps,
  orderFormId?: string
): Promise<OrderForm> => {
  deps.logger.debug("Getting order form", { orderFormId });
  const path = orderFormId
    ? `${API_PATHS.ORDER_FORM}/${orderFormId}`
    : API_PATHS.ORDER_FORM;
  return deps.httpClient.get<OrderForm>(path);
};

export const createOrderForm = async (deps: CheckoutDeps): Promise<OrderForm> => {
  deps.logger.debug("Creating order form");
  return deps.httpClient.post<OrderForm>(API_PATHS.ORDER_FORM);
};

export const addItem = async (
  deps: CheckoutDeps,
  orderFormId: string,
  items: AddItemInput[]
): Promise<OrderForm> => {
  deps.logger.debug("Adding items to order form", { orderFormId, count: items.length });
  return deps.httpClient.post<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/items`,
    { body: { orderItems: items } }
  );
};

export const removeItem = async (
  deps: CheckoutDeps,
  orderFormId: string,
  itemIndex: number
): Promise<OrderForm> => {
  deps.logger.debug("Removing item from order form", { orderFormId, itemIndex });
  return deps.httpClient.delete<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/items/${itemIndex}`
  );
};

export const updateItems = async (
  deps: CheckoutDeps,
  orderFormId: string,
  items: UpdateItemInput[]
): Promise<OrderForm> => {
  deps.logger.debug("Updating items in order form", { orderFormId });
  return deps.httpClient.patch<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/items`,
    { body: { orderItems: items } }
  );
};

export const setShipping = async (
  deps: CheckoutDeps,
  orderFormId: string,
  shippingData: Partial<ShippingData>
): Promise<OrderForm> => {
  deps.logger.debug("Setting shipping data", { orderFormId });
  return deps.httpClient.post<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/attachments/shippingData`,
    { body: shippingData }
  );
};

export const setPayment = async (
  deps: CheckoutDeps,
  orderFormId: string,
  paymentData: Partial<PaymentData>
): Promise<OrderForm> => {
  deps.logger.debug("Setting payment data", { orderFormId });
  return deps.httpClient.post<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/attachments/paymentData`,
    { body: paymentData }
  );
};

export const setClientProfile = async (
  deps: CheckoutDeps,
  orderFormId: string,
  profileData: Partial<ClientProfileData>
): Promise<OrderForm> => {
  deps.logger.debug("Setting client profile", { orderFormId });
  return deps.httpClient.post<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/attachments/clientProfileData`,
    { body: profileData }
  );
};

export const placeOrder = async (
  deps: CheckoutDeps,
  orderFormId: string
): Promise<unknown> => {
  deps.logger.debug("Placing order", { orderFormId });
  return deps.httpClient.post<unknown>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/transaction`
  );
};

export const getInstallments = async (
  deps: CheckoutDeps,
  orderFormId: string
): Promise<Installment[]> => {
  deps.logger.debug("Getting installments", { orderFormId });
  return deps.httpClient.get<Installment[]>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/installments`
  );
};

export const addCoupon = async (
  deps: CheckoutDeps,
  orderFormId: string,
  couponCode: string
): Promise<OrderForm> => {
  deps.logger.debug("Adding coupon", { orderFormId, couponCode });
  return deps.httpClient.post<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/coupons`,
    { body: { text: couponCode } }
  );
};

export const removeCoupon = async (
  deps: CheckoutDeps,
  orderFormId: string
): Promise<OrderForm> => {
  deps.logger.debug("Removing coupon", { orderFormId });
  return deps.httpClient.delete<OrderForm>(
    `${API_PATHS.ORDER_FORM}/${orderFormId}/coupons`
  );
};
