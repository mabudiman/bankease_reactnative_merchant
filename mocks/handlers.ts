import { http, HttpResponse, delay } from "msw";
import type { RequestHandler } from "msw";
import { API_BASE_URL } from "@/constants";
import {
  MOCK_BRANCHES,
  MOCK_EXCHANGE_RATES,
  MOCK_INTEREST_RATES,
  MOCK_BENEFICIARIES,
} from "./data";
import type { Beneficiary } from "@/features/mobile-prepaid/types";

// Mutable copy so POST can append
let beneficiaries: Beneficiary[] = [...MOCK_BENEFICIARIES];

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

  // ─── Mobile Prepaid ───────────────────────────────────────────────────────

  http.get(`${API_BASE_URL}/api/beneficiaries`, () => {
    return HttpResponse.json(beneficiaries);
  }),

  http.post(`${API_BASE_URL}/api/beneficiaries`, async ({ request }) => {
    const body = (await request.json()) as { name: string; phoneNumber: string };
    const newBen: Beneficiary = {
      id: `ben-${Date.now()}`,
      name: body.name,
      phoneNumber: body.phoneNumber,
    };
    beneficiaries.push(newBen);
    return HttpResponse.json(newBen, { status: 201 });
  }),

  http.post(`${API_BASE_URL}/api/prepaid/purchase`, async () => {
    await delay(1000);
    return HttpResponse.json({
      id: `txn-${Date.now()}`,
      status: "success",
      message: "Mobile prepaid purchase completed successfully.",
    });
  }),
];
