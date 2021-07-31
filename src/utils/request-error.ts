export class RequestError extends Error {
  public statusCode: number;

  public constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }
}
