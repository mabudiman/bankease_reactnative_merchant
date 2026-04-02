import { http, HttpResponse, passthrough } from "msw";
import type { RequestHandler } from "msw";
import { API_BASE_URL } from "@/constants";
import {
  MOCK_BRANCHES,
  MOCK_EXCHANGE_RATES,
  MOCK_INTEREST_RATES,
  MOCK_MESSAGES,
  MOCK_MESSAGE_THREADS,
  MOCK_TRANSFER_CARDS,
  MOCK_BENEFICIARIES,
  MOCK_BANKS,
  MOCK_BANK_BRANCHES,
  MOCK_PROFILE_API_RESPONSE,
} from "./data";

// ─── Test-only handlers (full mocks for Jest) ────────────────────────────────
export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/api/exchange-rates`, () => {
    return HttpResponse.json({
      exchange_rates: MOCK_EXCHANGE_RATES.map(({ countryCode, ...rest }) => ({
        ...rest,
        country_code: countryCode,
      })),
    });
  }),

  http.get(`${API_BASE_URL}/api/interest-rates`, () => {
    return HttpResponse.json({ interest_rates: MOCK_INTEREST_RATES });
  }),

  http.get(`${API_BASE_URL}/api/branches`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";
    const results = q
      ? MOCK_BRANCHES.filter((b) => b.name.toLowerCase().includes(q))
      : MOCK_BRANCHES;
    return HttpResponse.json({ branches: results });
  }),

  http.get(`${API_BASE_URL}/api/messages`, () => {
    return HttpResponse.json(MOCK_MESSAGES);
  }),

  http.get(`${API_BASE_URL}/api/messages/:id`, ({ params }) => {
    const thread = MOCK_MESSAGE_THREADS.find((t) => t.id === params.id);
    if (!thread) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(thread);
  }),

  // ─── Profile handlers (test mocks) ───────────────────────────────────────

  http.get(`${API_BASE_URL}/api/profile`, () => {
    return HttpResponse.json(MOCK_PROFILE_API_RESPONSE);
  }),

  http.get(`${API_BASE_URL}/api/profile/:accountId`, () => {
    return HttpResponse.json(MOCK_PROFILE_API_RESPONSE);
  }),

  http.put(`${API_BASE_URL}/api/profile/:accountId`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...MOCK_PROFILE_API_RESPONSE, ...body });
  }),

  // ─── Transfer handlers ────────────────────────────────────────────────────

  http.get(`${API_BASE_URL}/api/cards`, () => {
    return HttpResponse.json(MOCK_TRANSFER_CARDS);
  }),

  http.get(`${API_BASE_URL}/api/beneficiaries`, () => {
    return HttpResponse.json(MOCK_BENEFICIARIES);
  }),

  http.get(`${API_BASE_URL}/api/banks`, () => {
    return HttpResponse.json(MOCK_BANKS);
  }),

  http.get(`${API_BASE_URL}/api/banks/:bankId/branches`, ({ params }) => {
    const branches = MOCK_BANK_BRANCHES.filter((b) => b.bankId === params.bankId);
    return HttpResponse.json(branches);
  }),

  http.post(`${API_BASE_URL}/api/transfer`, async () => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return HttpResponse.json({
      id: `txn-${Date.now()}`,
      status: "success",
      message: "Transfer successful",
      timestamp: new Date().toISOString(),
    });
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

// ─── Runtime handlers (for dev builds — passthrough to real API) ──────────────
export const runtimeHandlers: RequestHandler[] = [
  // Let profile, search endpoints pass through to the real backend
  http.get(`${API_BASE_URL}/api/profile`, () => passthrough()),
  http.get(`${API_BASE_URL}/api/profile/:accountId`, () => passthrough()),
  http.put(`${API_BASE_URL}/api/profile/:accountId`, () => passthrough()),
  http.get(`${API_BASE_URL}/api/exchange-rates`, () => passthrough()),
  http.get(`${API_BASE_URL}/api/interest-rates`, () => passthrough()),
  http.get(`${API_BASE_URL}/api/branches`, () => passthrough()),

  // ─── Messages (mocked — not yet on real backend) ──────────────────────
  http.get(`${API_BASE_URL}/api/messages`, () => {
    return HttpResponse.json(MOCK_MESSAGES);
  }),

  http.get(`${API_BASE_URL}/api/messages/:id`, ({ params }) => {
    const thread = MOCK_MESSAGE_THREADS.find((t) => t.id === params.id);
    if (!thread) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(thread);
  }),

  // ─── Transfer (mocked — not yet on real backend) ──────────────────────
  http.get(`${API_BASE_URL}/api/cards`, () => {
    return HttpResponse.json(MOCK_TRANSFER_CARDS);
  }),

  http.get(`${API_BASE_URL}/api/beneficiaries`, () => {
    return HttpResponse.json(MOCK_BENEFICIARIES);
  }),

  http.get(`${API_BASE_URL}/api/banks`, () => {
    return HttpResponse.json(MOCK_BANKS);
  }),

  http.get(`${API_BASE_URL}/api/banks/:bankId/branches`, ({ params }) => {
    const branches = MOCK_BANK_BRANCHES.filter((b) => b.bankId === params.bankId);
    return HttpResponse.json(branches);
  }),

  http.post(`${API_BASE_URL}/api/transfer`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return HttpResponse.json({
      id: `txn-${Date.now()}`,
      status: "success",
      message: "Transfer successful",
      timestamp: new Date().toISOString(),
    });
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
