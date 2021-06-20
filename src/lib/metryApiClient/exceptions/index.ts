export class MetriApiError extends Error {
  protected code;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.message = `Call to metriApi failed with message: ${this.message}`;
  }

  public getMessage() {
    return this.message;
  }
}
