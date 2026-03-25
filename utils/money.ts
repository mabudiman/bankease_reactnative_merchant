import { validateIBAN } from "./iban";
import { log } from "./log";

/**
 * Convert a minor unit amount to a major unit amount.
 */
export function minorToMajor(amount: number): number {
  return amount / 100;
}

/**
 * Format a currency amount.
 */
export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(minorToMajor(amount));
}

/**
 * Convert an amount to a minor unit amount.
 */
export function convertAmountToMinorUnits(amount: string): number {
  const normalizedAmount = normalizeAmount(amount);
  const numAmount = Number(normalizedAmount);

  if (isNaN(numAmount) || numAmount <= 0) {
    log("MONEY", "INVALID_AMOUNT", { amount });
    return 0;
  }

  return Math.round(numAmount * 100);
}

/**
 * Normalize an amount.
 */
export function normalizeAmount(amount: string) {
  return amount.replace(/,/g, "");
}

/**
 * Format an amount input.
 */
export function formatAmountInput(value: string): string {
  if (!value) return "";

  let cleaned = value.replace(/[^\d.,]/g, "");

  const commaIndex = cleaned.indexOf(",");
  const dotIndex = cleaned.indexOf(".");
  const separatorIndex =
    commaIndex !== -1 && dotIndex !== -1
      ? Math.min(commaIndex, dotIndex)
      : commaIndex !== -1
        ? commaIndex
        : dotIndex;

  let integerPart = "";
  let decimalPart = "";

  if (separatorIndex === -1) {
    integerPart = cleaned;
  } else {
    integerPart = cleaned.substring(0, separatorIndex);
    decimalPart = cleaned.substring(separatorIndex + 1).replace(/[.,]/g, "");
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.substring(0, 2);
    }
  }

  let formatted = integerPart;
  if (separatorIndex !== -1) {
    formatted += "." + decimalPart;
  }

  return formatted;
}
