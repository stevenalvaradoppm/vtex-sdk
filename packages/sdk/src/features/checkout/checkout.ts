import type { IHttpClient } from "../../ports/http-client";
import type { ILogger } from "../../ports/logger";
import type {
    OrderForm,
    AddItemInput,
    ShippingDataInput,
    ClientProfileDataInput,
} from "./types";
import { API_PATHS } from "../../constants";

export interface CheckoutDeps {
    httpClient: IHttpClient;
    logger: ILogger;
}

export const createOrderForm = async (deps: CheckoutDeps): Promise<OrderForm> => {
    deps.logger.debug("Creating order form");
    return deps.httpClient.post<OrderForm>(API_PATHS.ORDER_FORM, { body: {} });
};

export const getProducts = async (deps: CheckoutDeps): Promise<unknown> => {
    deps.logger.debug("Getting products");
    return deps.httpClient.get<unknown>(API_PATHS.PRODUCT_SEARCH);
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

export const setShipping = async (
    deps: CheckoutDeps,
    orderFormId: string,
    shippingData: ShippingDataInput
): Promise<OrderForm> => {
    deps.logger.debug("Setting shipping data", { orderFormId });
    return deps.httpClient.post<OrderForm>(
        `${API_PATHS.ORDER_FORM}/${orderFormId}/attachments/shippingData`,
        { body: shippingData }
    );
};

export const setClientProfile = async (
    deps: CheckoutDeps,
    orderFormId: string,
    profileData: ClientProfileDataInput
): Promise<OrderForm> => {
    deps.logger.debug("Setting client profile", { orderFormId });
    return deps.httpClient.post<OrderForm>(
        `${API_PATHS.ORDER_FORM}/${orderFormId}/attachments/clientProfileData`,
        { body: profileData }
    );
};
