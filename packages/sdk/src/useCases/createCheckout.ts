import type { Client } from "../client.js";
import type { ClientProfileData, OrderItem, ShippingData } from "../types.js";

export async function createCheckout(params: {
  client: Client;
  items: OrderItem[];
  shippingData: ShippingData;
  clientProfileData: ClientProfileData;
}) {
  const { client, items, shippingData, clientProfileData } = params;

  await client.createSession();

  const { orderFormId } = await client.createOrderForm();

  await client.addItems(orderFormId, items);

  await client.attachShippingData(orderFormId, shippingData);

  await client.attachClientProfileData(orderFormId, clientProfileData);

  return orderFormId;
}
