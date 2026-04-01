const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen',
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

function wordsBelow1000(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n] ?? '';
  if (n < 100) {
    const ten = TENS[Math.floor(n / 10)] ?? '';
    const one = ONES[n % 10] ?? '';
    return one ? `${ten} ${one}` : ten;
  }
  const hundreds = ONES[Math.floor(n / 100)] ?? '';
  const rest = wordsBelow1000(n % 100);
  return rest ? `${hundreds} hundred ${rest}` : `${hundreds} hundred`;
}

/**
 * Convert a non-negative integer to an English words string.
 * e.g. 1000 → "one thousand", 1234 → "one thousand two hundred thirty four"
 */
export function numberToWords(n: number): string {
  const integer = Math.floor(Math.abs(n));
  if (integer === 0) return 'zero';

  const billion = Math.floor(integer / 1_000_000_000);
  const million = Math.floor((integer % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((integer % 1_000_000) / 1_000);
  const remainder = integer % 1_000;

  const parts: string[] = [];
  if (billion) parts.push(`${wordsBelow1000(billion)} billion`);
  if (million) parts.push(`${wordsBelow1000(million)} million`);
  if (thousand) parts.push(`${wordsBelow1000(thousand)} thousand`);
  if (remainder) parts.push(wordsBelow1000(remainder));

  const words = parts.join(' ');
  // Capitalise first letter
  return words.charAt(0).toUpperCase() + words.slice(1);
}
