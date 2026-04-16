import { NextResponse } from "next/server";
import { createClient } from "@repo/sdk";

export async function GET() {
  try {
    const client = createClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    const products = await client.checkout.getProducts();

    return NextResponse.json({ success: true, data: products });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
