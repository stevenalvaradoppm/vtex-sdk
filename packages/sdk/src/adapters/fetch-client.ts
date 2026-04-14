import type { IHttpClient, RequestOptions } from "../ports/http-client";
import type { VtexConfig } from "../types";
import { SdkError } from "../errors";
import { VTEX_HEADERS } from "../constants";

export class FetchClient implements IHttpClient {
  private readonly cookies: string[] = [];

  constructor(private readonly config: VtexConfig) {}

  private getAuthHeaders(): Record<string, string> {
    return {
      [VTEX_HEADERS.APP_KEY]: this.config.appKey,
      [VTEX_HEADERS.APP_TOKEN]: this.config.appToken,
    };
  }

  private getCookieHeader(): string {
    return this.cookies.map(c => c.split(";")[0]!.trim()).join("; ");
  }

  private updateCookies(res: Response): void {
    const raw = res.headers.get("set-cookie");
    if (!raw) return;
    this.cookies.push(...raw.split(","));
  }

  private async request<T>(
    path: string,
    method: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const cookieHeader = this.getCookieHeader();

    const headers = new Headers({
      ...this.getAuthHeaders(),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...options?.headers,
    });

    headers.set("Content-Type", "application/json");

    const res = await fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : null,
    });

    this.updateCookies(res);

    if (!res.ok) {
      throw new SdkError("HTTP_ERROR", `HTTP ${res.status}: ${res.statusText}`, res.status);
    }

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, "GET", options);
  }

  post<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, "POST", options);
  }

  put<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, "PUT", options);
  }

  patch<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, "PATCH", options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, "DELETE", options);
  }
}
