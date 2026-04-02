/**
 * Hook to initialize MSW in development mode
 */
import { useEffect, useState } from "react";

const MSW_TIMEOUT_MS = 3000;

/**
 * Controlled via EXPO_PUBLIC_MSW_ENABLED in .env / .env.local.
 * Set to "false" in .env.local to bypass MSW and hit the real backend.
 * Defaults to true so all developers get mocks out of the box.
 */
const MSW_ENABLED = process.env.EXPO_PUBLIC_MSW_ENABLED !== "false";

export function useMSW() {
  const [isReady, setIsReady] = useState(!__DEV__ || !MSW_ENABLED);

  useEffect(() => {
    if (__DEV__ && MSW_ENABLED) {
      let resolved = false;

      const markReady = () => {
        if (!resolved) {
          resolved = true;
          setIsReady(true);
        }
      };

      // Safety timeout — unblock the app if MSW hangs
      const timeout = setTimeout(() => {
        console.warn(
          "[useMSW] MSW init timed out after " +
            MSW_TIMEOUT_MS +
            "ms, proceeding without mocks",
        );
        markReady();
      }, MSW_TIMEOUT_MS);

      const enableMocking = async () => {
        // Server imports polyfills automatically, so we can import directly
        const { server } = await import("./server");

        console.log("[useMSW] Starting MSW server");
        server.listen();
        console.log("[useMSW] MSW server started successfully");
        clearTimeout(timeout);
        markReady();
      };

      enableMocking().catch((error) => {
        console.error("[useMSW] Failed to enable MSW:", error);
        clearTimeout(timeout);
        // Still set ready to true to prevent blocking the app
        markReady();
      });
    }
  }, []);

  return isReady;
}
