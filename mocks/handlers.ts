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

// TODO: Uncomment and implement when the backend profile API is live.
// import { http, HttpResponse } from "msw";
//
// Profile API stubs — swap profile-service.ts AsyncStorage calls with profileApi.*:
//
// http.get('http://localhost:3000/api/profile/:accountId', ({ params }) => {
//   const { accountId } = params;
//   return HttpResponse.json({
//     accountId,
//     bankName: 'Citibank',
//     branchName: 'New York',
//     transactionName: 'Demo User',
//     cardNumber: '1234 5678 9901',
//   });
// }),
//
// http.put('http://localhost:3000/api/profile/:accountId', async ({ params, request }) => {
//   const { accountId } = params;
//   const body = await request.json();
//   return HttpResponse.json({ accountId, ...body });
// }),

export const handlers: RequestHandler[] = [];
