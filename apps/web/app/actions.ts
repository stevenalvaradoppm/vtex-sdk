"use server";

import { getVtexClient } from "../lib/vtex-client";
import type {
  AddItemInput,
  ShippingDataInput,
  ClientProfileDataInput,
  OrderForm,
} from "@repo/sdk";

export async function createSessionAction(email?: string): Promise<void> {
  const client = getVtexClient();
  await client.session.createSession(email);
}

export async function getProductsAction(): Promise<unknown> {
  const client = getVtexClient();
  return client.checkout.getProducts();
}

export async function createOrderFormAction(): Promise<OrderForm> {
  const client = getVtexClient();
  await client.session.createSession();
  return client.checkout.createOrderForm();
}

export async function addItemAction(
  orderFormId: string,
  items: AddItemInput[]
): Promise<OrderForm> {
  const client = getVtexClient();
  await client.session.createSession();
  return client.checkout.addItem(orderFormId, items);
}

export async function setShippingAction(
  orderFormId: string,
  shippingData: ShippingDataInput
): Promise<OrderForm> {
  const client = getVtexClient();
  await client.session.createSession();
  return client.checkout.setShipping(orderFormId, shippingData);
}

export async function setClientProfileAction(
  orderFormId: string,
  profileData: ClientProfileDataInput
): Promise<OrderForm> {
  const client = getVtexClient();
  await client.session.createSession();
  return client.checkout.setClientProfile(orderFormId, profileData);
}
