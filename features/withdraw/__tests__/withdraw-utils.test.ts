import { isValidPhone, maskAccountNumber } from '../utils';

describe('maskAccountNumber', () => {
  it('masks a 12-digit account number into VISA format', () => {
    expect(maskAccountNumber('4411 0000 1234')).toBe('VISA **** **** **** 1234');
  });

  it('masks an account number without spaces', () => {
    expect(maskAccountNumber('190089885456')).toBe('VISA **** **** **** 5456');
  });

  it('uses last 4 digits when number is exactly 4 digits', () => {
    expect(maskAccountNumber('5678')).toBe('VISA **** **** **** 5678');
  });

  it('pads with zeros when label has fewer than 4 digits', () => {
    const result = maskAccountNumber('12');
    expect(result).toMatch(/^VISA \*\*\*\* \*\*\*\* \*\*\*\* \d{4}$/);
  });

  it('returns a masked label for empty string', () => {
    const result = maskAccountNumber('');
    expect(result).toBe('VISA **** **** **** 0000');
  });
});

describe('isValidPhone', () => {
  it('returns true for a valid international number with +', () => {
    expect(isValidPhone('+8564757899')).toBe(true);
  });

  it('returns true for a plain 8-digit number', () => {
    expect(isValidPhone('12345678')).toBe(true);
  });

  it('returns true for a number with spaces and dashes', () => {
    expect(isValidPhone('+62 812-345-678')).toBe(true);
  });

  it('returns false for a number shorter than 8 digits', () => {
    expect(isValidPhone('123')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidPhone('')).toBe(false);
  });

  it('returns false for a number with exactly 7 digits', () => {
    expect(isValidPhone('1234567')).toBe(false);
  });

  it('returns true for exactly 8 digits (boundary)', () => {
    expect(isValidPhone('12345678')).toBe(true);
  });
});
