import { dashboardService } from "@/features/dashboard/services/dashboard-service";
import type { PaymentCard } from "@/features/dashboard/types";

export async function getAvailableCards(accountId: string): Promise<PaymentCard[]> {
  return dashboardService.loadCards(accountId);
}
