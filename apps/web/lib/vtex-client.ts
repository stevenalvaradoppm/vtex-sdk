import { cache } from "react";
import { createClient } from "@repo/sdk";

const buildClient = () =>
  createClient({
    baseUrl: process.env.VTEX_BASE_URL!,
    appKey: process.env.VTEX_APP_KEY!,
    appToken: process.env.VTEX_APP_TOKEN!,
  });

export const getVtexClient = cache(buildClient);
