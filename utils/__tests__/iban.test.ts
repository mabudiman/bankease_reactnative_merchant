import { validateIBAN, maskIban } from "@/utils/iban";

describe("validateIBAN", () => {
  it("returns false when length is less than 15", () => {
    expect(validateIBAN("GB82WEST12345")).toBe(false);
    expect(validateIBAN("ES912100041")).toBe(false);
  });

  it("returns false when length is greater than 34", () => {
    const long = "ES9121000418450200051332EXTRA123456";
    expect(long.length).toBe(35);
    expect(validateIBAN(long)).toBe(false);
  });

  it("returns false when format is invalid (not 2 letters + 2 digits at start)", () => {
    expect(validateIBAN("9E9121000418450200051332")).toBe(false);
    expect(validateIBAN("E29121000418450200051332")).toBe(false);
    expect(validateIBAN("ES9A21000418450200051332")).toBe(false);
    expect(validateIBAN("1S9121000418450200051332")).toBe(false);
  });

  it("returns false when string contains invalid characters", () => {
    expect(validateIBAN("ES91 2100 0418 4502 0005 1332!")).toBe(false);
  });

  it("returns true for valid format and length (15-34 chars, 2 letters + 2 digits + alphanumeric)", () => {
    expect(validateIBAN("ES9121000418450200051332")).toBe(true);
    expect(validateIBAN("GB82WEST12345698765432")).toBe(true);
  });

  it("strips spaces and uppercases before validating", () => {
    expect(validateIBAN("es91 2100 0418 4502 0005 1332")).toBe(true);
  });
});

describe("maskIban", () => {
  it("returns iban unchanged when length is less than 6", () => {
    expect(maskIban("")).toBe("");
    expect(maskIban("ES91")).toBe("ES91");
    expect(maskIban("12345")).toBe("12345");
  });

  it("masks middle with asterisks, keeping first 4 and last 4", () => {
    expect(maskIban("ES9121000418450200051332")).toBe(
      "ES91***************1332",
    );
  });

  it("handles exactly 6 characters", () => {
    expect(maskIban("ES9121")).toBe("ES91***************9121");
  });
});
