export const SDK_VERSION = "0.0.1";

export const VTEX_HEADERS = {
  APP_KEY: "X-VTEX-API-AppKey",
  APP_TOKEN: "X-VTEX-API-AppToken",
} as const;

export const API_PATHS = {
  SESSIONS: "/api/sessions",
  ORDER_FORM: "/api/checkout/pub/orderForm",
} as const;
