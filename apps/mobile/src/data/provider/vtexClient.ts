import { createClient } from "@repo/sdk";

export const vtexClient = createClient({
  baseUrl: process.env.EXPO_PUBLIC_VTEX_BASE_URL ?? "",
  appKey: process.env.EXPO_PUBLIC_VTEX_APP_KEY ?? "",
  appToken: process.env.EXPO_PUBLIC_VTEX_APP_TOKEN ?? "",
});
