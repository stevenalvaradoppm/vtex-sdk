import { Client } from "sdk/client";

export function createVtexClient() {
  const baseUrl = process.env.VTEX_BASE_URL;

  if (!baseUrl) {
    throw new Error("VTEX_BASE_URL is not defined");
  }

  return new Client(baseUrl);
}