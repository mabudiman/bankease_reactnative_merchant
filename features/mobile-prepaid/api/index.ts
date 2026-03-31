import { request } from "@/core/api/client";
import type {
  Beneficiary,
  PrepaidPurchaseRequest,
  PrepaidPurchaseResponse,
} from "../types";

export async function getBeneficiaries(): Promise<Beneficiary[]> {
  return request<Beneficiary[]>("/api/beneficiaries");
}

export async function addBeneficiary(data: {
  name: string;
  phoneNumber: string;
}): Promise<Beneficiary> {
  return request<Beneficiary>("/api/beneficiaries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function purchasePrepaid(
  data: PrepaidPurchaseRequest,
): Promise<PrepaidPurchaseResponse> {
  return request<PrepaidPurchaseResponse>("/api/prepaid/purchase", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
