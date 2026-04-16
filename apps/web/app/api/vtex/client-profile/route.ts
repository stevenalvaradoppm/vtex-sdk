import { NextResponse } from "next/server";
import { createClient } from "@repo/sdk";
import type { ClientProfileDataInput } from "@repo/sdk";

export async function POST(request: Request) {
  try {
    const { orderFormId, profileData }: { orderFormId: string; profileData: ClientProfileDataInput } =
      await request.json();

    if (!orderFormId || !profileData) {
      return NextResponse.json(
        { success: false, error: "orderFormId and profileData are required" },
        { status: 400 }
      );
    }

    const client = createClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    const result = await client.checkout.setClientProfile(orderFormId, profileData);

    return NextResponse.json({ success: true, data: result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
