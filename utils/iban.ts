/**
 * Validate an IBAN.
 */
export function validateIBAN(iban: string): boolean {
  const cleaned = iban.replaceAll(/\s/g, "").toUpperCase();

  if (cleaned.length < 15 || cleaned.length > 34) {
    return false;
  }

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) {
    return false;
  }

  return true;
}

export function maskIban(iban: string) {
  if (iban.length < 6) return iban;
  return `${iban.slice(0, 4)}***************${iban.slice(-4)}`;
}
