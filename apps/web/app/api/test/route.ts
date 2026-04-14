import { NextResponse } from "next/server";
import { createClient } from "@repo/sdk";

export async function GET() {
  try {
    const client = createClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    await client.session.createSession();

    const orderForm = await client.checkout.createOrderForm();

    await client.checkout.addItem(orderForm.orderFormId, [
      {
        id: 123, // real SKU required
        quantity: 1,
        seller: "1",
      },
    ]);

    return NextResponse.json(orderForm);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}