export interface VtexClientConfig {
  baseUrl: string;
  appKey: string;
  appToken: string;
}

export class VtexClient {
  private baseUrl: string;
  private appKey: string;
  private appToken: string;
  private cookies: string[] = [];

  constructor(config: VtexClientConfig) {
    this.baseUrl = config.baseUrl;
    this.appKey = config.appKey;
    this.appToken = config.appToken;
  }

  private updateCookies(res: Response) {
    const raw = res.headers.get("set-cookie");
    if (!raw) return;

    // naive split (enough for testing)
    const parts = raw.split(",");
    this.cookies.push(...parts);
  }

  private cookieHeader() {
    return this.cookies.map(c => c.split(";")[0]).join("; ");
  }

  async createSession() {
    const res = await fetch(`${this.baseUrl}/api/sessions?forceNew=true`, {
      headers: {
        "X-VTEX-API-AppKey": this.appKey,
        "X-VTEX-API-AppToken": this.appToken,
      },
    });
    this.updateCookies(res);
    if (!res.ok) throw new Error("session failed");
  }

  async createOrderForm() {
    const res = await fetch(
      `${this.baseUrl}/api/checkout/pub/orderForm`,
      {
        method: "POST",
        headers: {
          "X-VTEX-API-AppKey": this.appKey,
          "X-VTEX-API-AppToken": this.appToken,
          Cookie: this.cookieHeader(),
        },
      }
    );

    if (!res.ok) throw new Error("orderForm failed");
    return res.json();
  }

  async addItems(orderFormId: string, items: any[]) {
    const res = await fetch(
      `${this.baseUrl}/api/checkout/pub/orderForm/${orderFormId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VTEX-API-AppKey": this.appKey,
          "X-VTEX-API-AppToken": this.appToken,
          Cookie: this.cookieHeader(),
        },
        body: JSON.stringify({ orderItems: items }),
      }
    );

    if (!res.ok) throw new Error("addItems failed");
    return res.json();
  }
}