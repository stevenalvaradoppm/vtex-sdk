import type { IHttpClient, RequestOptions } from "../../src/ports/http-client";

export class MockHttpClient implements IHttpClient {
  private responses = new Map<string, unknown>();
  readonly calls: Array<{ method: string; path: string; options?: RequestOptions }> = [];

  mockResponse(path: string, response: unknown): void {
    this.responses.set(path, response);
  }

  private record(method: string, path: string, options?: RequestOptions): unknown {
    this.calls.push({ method, path, options });
    const key = path.split("?")[0];
    if (this.responses.has(path)) return this.responses.get(path);
    if (this.responses.has(key)) return this.responses.get(key);
    throw new Error(`MockHttpClient: no mock set for ${method} ${path}`);
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return Promise.resolve(this.record("GET", path, options) as T);
  }

  post<T>(path: string, options?: RequestOptions): Promise<T> {
    return Promise.resolve(this.record("POST", path, options) as T);
  }

  put<T>(path: string, options?: RequestOptions): Promise<T> {
    return Promise.resolve(this.record("PUT", path, options) as T);
  }

  patch<T>(path: string, options?: RequestOptions): Promise<T> {
    return Promise.resolve(this.record("PATCH", path, options) as T);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return Promise.resolve(this.record("DELETE", path, options) as T);
  }
}
