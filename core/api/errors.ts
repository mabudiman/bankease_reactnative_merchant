/**
 * Custom Error Classes
 * Specific Domain Errors
 */
export class ApiError extends Error {
  code: string;
  recoverable: boolean;
  status?: number;

  constructor(
    code: string,
    message: string,
    recoverable = false,
    status?: number,
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.recoverable = recoverable;
    this.status = status;
  }
}

export class InsufficientFundsError extends ApiError {
  constructor() {
    super(
      "insufficient_funds",
      "Insufficient funds. Please check your balance.",
      false,
    );
    this.name = "InsufficientFundsError";
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor() {
    super(
      "service_unavailable",
      "Service temporarily unavailable. Please try again later.",
      true,
    );
    this.name = "ServiceUnavailableError";
  }
}

export class NetworkError extends ApiError {
  constructor() {
    super("network_error", "Connection lost. Please try again.", true);
    this.name = "NetworkError";
  }
}

export class BiometricCancelledError extends ApiError {
  constructor() {
    super(
      "biometric_cancelled",
      "Biometric authentication was cancelled.",
      true,
      401,
    );
    this.name = "BiometricCancelledError";
  }
}

export class BiometricUnavailableError extends ApiError {
  constructor() {
    super(
      "biometric_unavailable",
      "Biometric authentication is not available.",
      false,
      401,
    );
    this.name = "BiometricUnavailableError";
  }
}
