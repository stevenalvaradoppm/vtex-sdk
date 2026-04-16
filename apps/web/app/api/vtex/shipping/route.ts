import { NextResponse } from "next/server";
import { createClient } from "@repo/sdk";
import type { ShippingDataInput } from "@repo/sdk";

export async function POST(request: Request) {
  try {
    const { orderFormId, shippingData }: { orderFormId: string; shippingData: ShippingDataInput } =
      await request.json();

    if (!orderFormId || !shippingData) {
      return NextResponse.json(
        { success: false, error: "orderFormId and shippingData are required" },
        { status: 400 }
      );
    }

    const client = createClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    const result = await client.checkout.setShipping(orderFormId, shippingData);

    return NextResponse.json({ success: true, data: result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
