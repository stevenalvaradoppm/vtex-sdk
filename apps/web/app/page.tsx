"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ orderFormId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTest() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: "123", // replace with real SKU
              quantity: 1,
              seller: "1",
            },
          ],
          shippingData: {
            clearAddressIfPostalCodeNotFound: false,
            logisticsInfo: [
              {
                itemIndex: 0,
                selectedDeliveryChannel: "delivery",
                selectedSla: "Normal",
              },
            ],
            selectedAddresses: [
              {
                addressName: "home",
                addressType: "residential",
                city: "Quito",
                complement: "",
                country: "ECU",
                geoCoordinates: [-78.4678, -0.1807],
                number: "123",
                receiverName: "Test User",
                street: "Fake Street",
              },
            ],
          },
          clientProfileData: {
            document: "1234567890",
            documentType: "cedula",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            homePhone: "+593999999999",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>VTEX SDK Test</h1>

      <button onClick={handleTest} disabled={loading}>
        {loading ? "Running..." : "Run Checkout Flow"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <pre style={{ marginTop: 20 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </main>
  );
}
