import { http, HttpResponse, passthrough } from "msw";
import type { RequestHandler } from "msw";
import { API_BASE_URL } from "@/constants";
import { MOCK_BRANCHES, MOCK_EXCHANGE_RATES, MOCK_INTEREST_RATES, MOCK_PROFILE_API_RESPONSE } from "./data";

// ─── Test-only handlers (full mocks for Jest) ────────────────────────────────
export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/api/profile`, () => {
    return HttpResponse.json(MOCK_PROFILE_API_RESPONSE);
  }),

  http.put(`${API_BASE_URL}/api/profile/:accountId`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ ...MOCK_PROFILE_API_RESPONSE, ...body });
  }),

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

// ─── Runtime handlers (for dev builds — passthrough profile to real API) ──────
export const runtimeHandlers: RequestHandler[] = [
  // Let profile GET and PUT pass through to the real backend
  http.get(`${API_BASE_URL}/api/profile`, () => passthrough()),
  http.get(`${API_BASE_URL}/api/profile/:accountId`, () => passthrough()),
  http.put(`${API_BASE_URL}/api/profile/:accountId`, () => passthrough()),

  // Keep mocks for non-profile endpoints
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
