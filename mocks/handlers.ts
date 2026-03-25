/**
 * MSW Request Handlers
 * Add handlers here to mock API endpoints during development and testing.
 *
 * Example:
 *   import { http, HttpResponse } from "msw";
 *   import { API_BASE_URL } from "../constants";
 *
 *   export const handlers = [
 *     http.get(`${API_BASE_URL}/api/accounts`, () => {
 *       return HttpResponse.json({ accounts: [] });
 *     }),
 *   ];
 */
import type { RequestHandler } from "msw";

export const handlers: RequestHandler[] = [];
