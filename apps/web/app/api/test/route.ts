import { NextResponse } from "next/server";
import { VtexClient } from "@repo/sdk";

export async function GET() {
  try {
    const client = new VtexClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    await client.createSession();

    const orderForm = await client.createOrderForm();

    await client.addItems(orderForm.orderFormId, [
      {
        id: "123", // real SKU required
        quantity: 1,
        seller: "1",
      },
    ]);

    return NextResponse.json(orderForm);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}