/**
 * Masks an account number label into VISA card display format.
 * Example: "4411 0000 1234" → "VISA **** **** **** 1234"
 */
export function maskAccountNumber(label: string): string {
  const digits = label.replaceAll(/\s/g, '');
  const last4 = digits.slice(-4).padStart(4, '0');
  return `VISA **** **** **** ${last4}`;
}

/**
 * Returns true when the phone number contains at least 8 digits.
 * Strips leading +, spaces, and dashes before counting.
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replaceAll(/[\s+\-()]/g, '');
  return digits.length >= 8;
}
