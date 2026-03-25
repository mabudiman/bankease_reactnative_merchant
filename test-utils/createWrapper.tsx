import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "@/test-utils/createTestQueryClient";
import { I18nProvider } from "@/core/i18n";
import { translations } from "@/app/i18n";

/**
 * Create a wrapper for the test environment.
 *
 * Responsibilities:
 * - Provide QueryClient and I18nProvider so components using useQuery/useMutation or useTranslation render without throwing
 * - Return the test query client for cache assertions
 */
export function createWrapper() {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nProvider translations={translations}>{children}</I18nProvider>
    </QueryClientProvider>
  );

  return { Wrapper, queryClient };
}
