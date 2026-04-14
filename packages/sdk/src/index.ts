export { createClient } from "./client";
export type { VtexConfig, ClientOptions, VtexContext, Result } from "./types";
export { SdkError } from "./errors";
export { SDK_VERSION } from "./constants";

export type { IHttpClient, RequestOptions } from "./ports/http-client";
export type { ILogger } from "./ports/logger";

export { FetchClient } from "./adapters/fetch-client";
export { ConsoleLogger } from "./adapters/console-logger";

export type { SessionFeature, SessionDeps } from "./features/session";
export type {
  VtexSession,
  SessionProfile,
  SessionSegment,
} from "./features/session";

export type { CheckoutFeature, CheckoutDeps } from "./features/checkout";
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
} from "./features/checkout";