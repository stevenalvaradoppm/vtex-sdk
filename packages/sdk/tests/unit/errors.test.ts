import { describe, it, expect } from "vitest";
import { SdkError } from "../../src/errors";

describe("SdkError", () => {
  it("should create an error with code and message", () => {
    const error = new SdkError("NOT_FOUND", "Resource not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBeUndefined();
    expect(error.name).toBe("SdkError");
  });

  it("should create an error with statusCode", () => {
    const error = new SdkError("HTTP_ERROR", "HTTP 404: Not Found", 404);
    expect(error.statusCode).toBe(404);
  });

  it("should be an instance of Error", () => {
    const error = new SdkError("TEST", "test");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SdkError);
  });
});
