import { NextResponse } from "next/server";
import { createClient } from "@repo/sdk";

export async function POST(request: Request) {
  try {
    const { orderFormId, items } = await request.json();

    if (!orderFormId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "orderFormId and items[] are required" },
        { status: 400 }
      );
    }

    const client = createClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    await client.session.createSession();
    const result = await client.checkout.addItem(orderFormId, items);

    return NextResponse.json({ success: true, data: result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
