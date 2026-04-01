import { log } from "../log";

// Override LOG_ENABLED to true so the log function's code paths are exercised.
// In production constants, LOG_ENABLED = false.
jest.mock("@/constants", () => ({
  LOG_ENABLED: true,
  API_BASE_URL: "http://localhost",
  API_TIMEOUT_MS: 10000,
}));

describe("log", () => {
  let infoSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  describe("type: info (default)", () => {
    it("calls console.info with flow and step", () => {
      log("Auth", "signIn");
      expect(infoSpy).toHaveBeenCalledWith("[Auth] signIn", "");
    });

    it("calls console.info with meta when provided", () => {
      const meta = { userId: "demo-001" };
      log("Auth", "signIn", meta);
      expect(infoSpy).toHaveBeenCalledWith("[Auth] signIn", meta);
    });

    it('calls console.info when type is explicitly "info"', () => {
      log("Dashboard", "loaded", undefined, "info");
      expect(infoSpy).toHaveBeenCalledWith("[Dashboard] loaded", "");
    });

    it("does not call console.error or console.warn for info type", () => {
      log("App", "start");
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("type: error", () => {
    it("calls console.error with flow and ERROR suffix", () => {
      log("Profile", "fetchFailed", undefined, "error");
      expect(errorSpy).toHaveBeenCalledWith("[Profile] ERROR", "");
    });

    it("calls console.error with meta when provided", () => {
      const meta = { code: 500 };
      log("API", "timeout", meta, "error");
      expect(errorSpy).toHaveBeenCalledWith("[API] ERROR", meta);
    });

    it("does not call console.info or console.warn for error type", () => {
      log("Service", "crashed", undefined, "error");
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("type: warning", () => {
    it("calls console.warn with flow and WARNING suffix", () => {
      log("Auth", "tokenExpiring", undefined, "warning");
      expect(warnSpy).toHaveBeenCalledWith("[Auth] WARNING", "");
    });

    it("calls console.warn with meta when provided", () => {
      const meta = { expiresIn: 60 };
      log("Session", "nearExpiry", meta, "warning");
      expect(warnSpy).toHaveBeenCalledWith("[Session] WARNING", meta);
    });

    it("does not call console.info or console.error for warning type", () => {
      log("Cache", "stale", undefined, "warning");
      expect(infoSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
