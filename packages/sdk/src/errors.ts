export class SdkError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "SdkError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
