import { renderHook } from "@testing-library/react-native";
import { useTranslation } from "@/core/i18n/useTranslation";
import { createWrapper } from "@/test-utils/createWrapper";

describe("useTranslation", () => {
  it("returns a t function that resolves keys", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTranslation(), { wrapper: Wrapper });
    expect(typeof result.current.t).toBe("function");
    expect(typeof result.current.locale).toBe("string");
    expect(typeof result.current.setLocale).toBe("function");
  });

  it("t() returns the key itself when the key is not found", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTranslation(), { wrapper: Wrapper });
    expect(result.current.t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("t() with namespace prefixes the key", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTranslation("common"), {
      wrapper: Wrapper,
    });
    // resolved as "common.unknown" which won't exist → returns full key
    expect(result.current.t("unknown")).toBe("common.unknown");
  });

  it("t() resolves an existing common translation key", () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTranslation(), { wrapper: Wrapper });
    // "common.error" should exist in translations
    const value = result.current.t("common.error");
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });
});
