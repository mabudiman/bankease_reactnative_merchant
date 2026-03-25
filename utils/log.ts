import { LOG_ENABLED } from "@/constants";

/**
 * Log a message.
 */
export function log(
  flow: string,
  step: string,
  meta?: Record<string, unknown>,
  type: "info" | "error" | "warning" = "info",
) {
  if (__DEV__ && LOG_ENABLED) {
    switch (type) {
      case "info":
        console.info(`[${flow}] ${step}`, meta ?? "");
        break;
      case "error":
        console.error(`[${flow}] ERROR`, meta ?? "");
        break;
      case "warning":
        console.warn(`[${flow}] WARNING`, meta ?? "");
        break;
    }
  }
}
