import { request } from "@/core/api/client";
import type {
  Beneficiary,
  PrepaidPaymentRequest,
  PrepaidPaymentResponse,
} from "../types";

export function getBeneficiaries(accountId: string): Promise<Beneficiary[]> {
  return request<Beneficiary[]>(
    `/api/mobile-prepaid/beneficiaries?accountId=${encodeURIComponent(accountId)}`,
  );
}

export function submitPrepaid(
  payload: PrepaidPaymentRequest,
): Promise<PrepaidPaymentResponse> {
  return request<PrepaidPaymentResponse>("/api/mobile-prepaid/pay", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
