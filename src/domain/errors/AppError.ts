export class AppError extends Error {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    
    // Garantir que a stack trace não mostre o construtor do AppError
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
