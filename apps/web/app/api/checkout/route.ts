import { NextRequest, NextResponse } from "next/server";
import { createVtexClient } from "@/lib/vtex";
import { createCheckout } from "sdk/useCases/createCheckout";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const client = createVtexClient();

    const orderFormId = await createCheckout({
      client,
      items: body.items,
      shippingData: body.shippingData,
      clientProfileData: body.clientProfileData,
    });

    return NextResponse.json({ orderFormId });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}