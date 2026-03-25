import {
  ApiError,
  InsufficientFundsError,
  ServiceUnavailableError,
  NetworkError,
  BiometricCancelledError,
  BiometricUnavailableError,
} from "@/core/api/errors";

describe("ApiError", () => {
  it("sets code, message, recoverable and optional status", () => {
    const err = new ApiError("test_code", "Test message", true, 500);
    expect(err.code).toBe("test_code");
    expect(err.message).toBe("Test message");
    expect(err.recoverable).toBe(true);
    expect(err.status).toBe(500);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it("defaults recoverable to false when not provided", () => {
    const err = new ApiError("code", "msg");
    expect(err.recoverable).toBe(false);
  });
});

describe("InsufficientFundsError", () => {
  it("has expected code, message and recoverable", () => {
    const err = new InsufficientFundsError();
    expect(err.code).toBe("insufficient_funds");
    expect(err.message).toBe("Insufficient funds. Please check your balance.");
    expect(err.recoverable).toBe(false);
  });

  it("has correct name and is instance of ApiError", () => {
    const err = new InsufficientFundsError();
    expect(err.name).toBe("InsufficientFundsError");
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(InsufficientFundsError);
  });
});

describe("ServiceUnavailableError", () => {
  it("has expected code, message and recoverable", () => {
    const err = new ServiceUnavailableError();
    expect(err.code).toBe("service_unavailable");
    expect(err.message).toBe(
      "Service temporarily unavailable. Please try again later.",
    );
    expect(err.recoverable).toBe(true);
  });

  it("has correct name and is instance of ApiError", () => {
    const err = new ServiceUnavailableError();
    expect(err.name).toBe("ServiceUnavailableError");
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(ServiceUnavailableError);
  });
});

describe("NetworkError", () => {
  it("has expected code, message and recoverable", () => {
    const err = new NetworkError();
    expect(err.code).toBe("network_error");
    expect(err.message).toBe("Connection lost. Please try again.");
    expect(err.recoverable).toBe(true);
  });

  it("has correct name and is instance of ApiError", () => {
    const err = new NetworkError();
    expect(err.name).toBe("NetworkError");
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(NetworkError);
  });
});

describe("BiometricCancelledError", () => {
  it("has expected code, message, recoverable and status", () => {
    const err = new BiometricCancelledError();
    expect(err.code).toBe("biometric_cancelled");
    expect(err.message).toBe("Biometric authentication was cancelled.");
    expect(err.recoverable).toBe(true);
    expect(err.status).toBe(401);
  });

  it("has correct name and is instance of ApiError", () => {
    const err = new BiometricCancelledError();
    expect(err.name).toBe("BiometricCancelledError");
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(BiometricCancelledError);
  });
});

describe("BiometricUnavailableError", () => {
  it("has expected code, message, recoverable and status", () => {
    const err = new BiometricUnavailableError();
    expect(err.code).toBe("biometric_unavailable");
    expect(err.message).toBe(
      "Biometric authentication is not available.",
    );
    expect(err.recoverable).toBe(false);
    expect(err.status).toBe(401);
  });

  it("has correct name and is instance of ApiError", () => {
    const err = new BiometricUnavailableError();
    expect(err.name).toBe("BiometricUnavailableError");
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(BiometricUnavailableError);
  });
});
