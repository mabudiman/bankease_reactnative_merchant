import { request } from "@/core/api/client";
import {
  ApiError,
  InsufficientFundsError,
  ServiceUnavailableError,
  NetworkError,
} from "@/core/api/errors";

describe("request (parseError)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("throws InsufficientFundsError when response status is 400", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 400 }) as unknown as Promise<Response>,
      );

    await expect(request("/api/test")).rejects.toThrow(InsufficientFundsError);
    await expect(request("/api/test")).rejects.toThrow("Insufficient funds");
  });

  it("throws ServiceUnavailableError when response status is 503", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 503 }) as unknown as Promise<Response>,
      );

    await expect(request("/api/test")).rejects.toThrow(ServiceUnavailableError);
    await expect(request("/api/test")).rejects.toThrow(
      "Service temporarily unavailable",
    );
  });

  it("throws ApiError with unknown_api_error for other non-ok status (404, 500)", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 404 }) as unknown as Promise<Response>,
      );

    await expect(request("/api/test")).rejects.toThrow(ApiError);
    try {
      await request("/api/test");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).code).toBe("unknown_api_error");
      expect((err as ApiError).message).toContain("unknown error");
      expect((err as ApiError).status).toBe(404);
    }
  });

  it("throws ApiError for 500 with status code in error", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(null, { status: 500 }) as unknown as Promise<Response>,
      );

    await expect(request("/api/test")).rejects.toThrow(ApiError);
    try {
      await request("/api/test");
    } catch (err) {
      expect((err as ApiError).status).toBe(500);
    }
  });
});

describe("request (fetchWithTimeout / NetworkError)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("throws NetworkError when fetch rejects (network failure or abort)", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new Error("Network request failed"));

    await expect(request("/api/test")).rejects.toThrow(NetworkError);
    await expect(request("/api/test")).rejects.toThrow("Connection lost");
  });

  it("throws NetworkError when fetch is aborted (timeout)", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new DOMException("Aborted", "AbortError"));

    await expect(request("/api/test")).rejects.toThrow(NetworkError);
  });
});
