import { NextResponse } from "next/server";
import { VtexClient } from "@repo/sdk";

export async function POST() {
  try {
    const client = new VtexClient({
      baseUrl: process.env.VTEX_BASE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!,
    });

    await client.createSession();

    return NextResponse.json({ success: true, message: "Session created" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
