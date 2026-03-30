import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";
import { API_BASE_URL } from "@/constants";
import {
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
];
