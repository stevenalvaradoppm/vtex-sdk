import type { ClientProfileData, OrderForm, OrderItem, ShippingData } from "./types.js";

// sdk/vtex/client.ts
type Fetcher = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class Client {
  private baseUrl: string;
  private fetcher: Fetcher;
  private cookies: string = "";

  constructor(baseUrl: string, fetcher: Fetcher = fetch) {
    this.baseUrl = baseUrl;
    this.fetcher = fetcher;
  }

  private setCookiesFromResponse(res: Response) {
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      this.cookies = setCookie;
    }
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.cookies && { Cookie: this.cookies }),
    };
  }

  async createSession(): Promise<void> {
    const res = await this.fetcher(
      `${this.baseUrl}/api/sessions?forceNew=true`,
      { method: "GET" }
    );

    this.setCookiesFromResponse(res);

    if (!res.ok) throw new Error("Failed to create session");
  }

  async createOrderForm(): Promise<OrderForm> {
    const res = await this.fetcher(
      `${this.baseUrl}/api/checkout/pub/orderForm`,
      {
        method: "POST",
        headers: this.getHeaders(),
      }
    );

    if (!res.ok) throw new Error("Failed to create orderForm");

    return res.json();
  }

  async addItems(orderFormId: string, items: OrderItem[]) {
    const res = await this.fetcher(
      `${this.baseUrl}/api/checkout/pub/orderForm/${orderFormId}`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ orderItems: items }),
      }
    );

    if (!res.ok) throw new Error("Failed to add items");

    return res.json();
  }

  async attachShippingData(orderFormId: string, shippingData: ShippingData) {
    const res = await this.fetcher(
      `${this.baseUrl}/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(shippingData),
      }
    );

    if (!res.ok) throw new Error("Failed to attach shippingData");

    return res.json();
  }

  async attachClientProfileData(
    orderFormId: string,
    clientProfileData: ClientProfileData
  ) {
    const res = await this.fetcher(
      `${this.baseUrl}/api/checkout/pub/orderForm/${orderFormId}/attachments/clientProfileData`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(clientProfileData),
      }
    );

    if (!res.ok) throw new Error("Failed to attach clientProfileData");

    return res.json();
  }
}