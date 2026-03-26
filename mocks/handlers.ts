import { http, HttpResponse } from "msw";
import type { RequestHandler } from "msw";
import { API_BASE_URL } from "@/constants";
import { MOCK_BRANCHES, MOCK_EXCHANGE_RATES, MOCK_INTEREST_RATES } from "./data";

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
];
