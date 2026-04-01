import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";
import { API_BASE_URL } from "@/constants";
import {
  MOCK_BENEFICIARIES,
  MOCK_BRANCHES,
  MOCK_EXCHANGE_RATES,
  MOCK_INTEREST_RATES,
  MOCK_PROVIDERS,
  INTERNET_BILL_DETAIL,
} from "./data";

// TODO: Add profile API stubs here when backend is live.

export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/api/exchange-rates`, () => {
    return HttpResponse.json(MOCK_EXCHANGE_RATES);
  }),

  http.get(`${API_BASE_URL}/api/interest-rates`, () => {
    return HttpResponse.json(MOCK_INTEREST_RATES);
  }),

  http.get(`${API_BASE_URL}/api/branches`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";
    const results = q
      ? MOCK_BRANCHES.filter((b) => b.name.toLowerCase().includes(q))
      : MOCK_BRANCHES;
    return HttpResponse.json(results);
  }),

  // ─── Pay The Bill ───────────────────────────────────────────────────────
  http.get(`${API_BASE_URL}/api/pay-the-bill/providers`, () => {
    return HttpResponse.json(MOCK_PROVIDERS);
  }),

  http.get(`${API_BASE_URL}/api/pay-the-bill/internet-bill`, () => {
    return HttpResponse.json(INTERNET_BILL_DETAIL);
  }),

  http.get(`${API_BASE_URL}/api/pay-the-bill/check`, ({ request }) => {
    const url = new URL(request.url);
    const billCode = url.searchParams.get("billCode") ?? "";
    if (!billCode) {
      return HttpResponse.json({ message: "Bill code is required" }, { status: 400 });
    }
  }),

  // ─── Mobile Prepaid ────────────────────────────────────────────────────
  http.get(`${API_BASE_URL}/api/mobile-prepaid/beneficiaries`, () => {
    return HttpResponse.json(MOCK_BENEFICIARIES);
  }),

  http.post(`${API_BASE_URL}/api/mobile-prepaid/pay`, async ({ request }) => {
    const body = (await request.json()) as {
      cardId?: string;
      phone?: string;
      amount?: number;
    };

    if (!body.cardId || !body.phone || !body.amount || body.amount <= 0) {
      return HttpResponse.json(
        { code: "VALIDATION_ERROR", message: "Invalid request" },
        { status: 400 },
      );
    }

    if (body.phone === "+0000000000") {
      return HttpResponse.json({
        id: `txn-${Date.now()}`,
        status: "FAILED",
        message: "Invalid phone number",
        timestamp: new Date().toISOString(),
      });
    }

    return HttpResponse.json({
      id: `txn-${Date.now()}`,
      status: "SUCCESS",
      message: "Payment successful",
      timestamp: new Date().toISOString(),
    });
  }),
];
