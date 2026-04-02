import { request } from "@/core/api/client";
import type { PaymentCard } from "@/features/dashboard/types";
import type {
  Beneficiary,
  PrepaidPaymentRequest,
  PrepaidPaymentResponse,
} from "../types";

export async function getCards(accountId: string): Promise<PaymentCard[]> {
  const data = await request<{ cards: PaymentCard[] }>(
    `/api/mobile-prepaid/cards?accountId=${encodeURIComponent(accountId)}`,
  );
  return data.cards;
}

export async function getBeneficiaries(accountId: string): Promise<Beneficiary[]> {
  const data = await request<{ beneficiaries: Beneficiary[] }>(
    `/api/mobile-prepaid/beneficiaries?accountId=${encodeURIComponent(accountId)}`,
  );
  return data.beneficiaries;
}

export function submitPrepaid(
  payload: PrepaidPaymentRequest,
): Promise<PrepaidPaymentResponse> {
  return request<PrepaidPaymentResponse>("/api/mobile-prepaid/pay", {
    method: "POST",
    headers: { "Idempotency-Key": payload.idempotencyKey },
    body: JSON.stringify(payload),
  });
}
