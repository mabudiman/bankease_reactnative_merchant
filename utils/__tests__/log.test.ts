import { log } from "@/utils/log";

describe("log", () => {
  beforeEach(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not throw when called with default type", () => {
    expect(() => log("FLOW", "STEP")).not.toThrow();
  });

  it("does not throw when called with info type", () => {
    expect(() => log("FLOW", "STEP", { key: "value" }, "info")).not.toThrow();
  });

  it("does not throw when called with error type", () => {
    expect(() => log("FLOW", "STEP", { key: "value" }, "error")).not.toThrow();
  });

  it("does not throw when called with warning type", () => {
    expect(() => log("FLOW", "STEP", { key: "value" }, "warning")).not.toThrow();
  });

  it("does not throw when called without meta", () => {
    expect(() => log("FLOW", "STEP", undefined, "info")).not.toThrow();
  });
});
