import { renderHook, waitFor } from "@testing-library/react-native";
import { useMenu, useMenuByAccountType } from "../index";
import type { MenuItem } from "../../types";

// Mock menuService to avoid real HTTP requests (no MSW handler for /api/menu)
jest.mock("@/features/account/services", () => ({
  menuService: {
    loadMenu: jest.fn(),
    loadMenuByAccountType: jest.fn(),
  },
}));

import { menuService } from "@/features/account/services";

const mockLoadMenu = menuService.loadMenu as jest.Mock;
const mockLoadMenuByAccountType = menuService.loadMenuByAccountType as jest.Mock;

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    index: 0,
    type: "REGULAR",
    title: "Transfer",
    icon_url: "icon1.png",
    is_active: true,
  },
  {
    id: "2",
    index: 1,
    type: "REGULAR",
    title: "Payment",
    icon_url: "icon2.png",
    is_active: true,
  },
  {
    id: "3",
    index: 2,
    type: "PREMIUM",
    title: "Investment",
    icon_url: "icon3.png",
    is_active: false,
  },
];

describe("useMenu", () => {
  it("starts in loading state with empty items", () => {
    mockLoadMenu.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useMenu());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("returns menu items after successful load", async () => {
    mockLoadMenu.mockResolvedValue(MOCK_MENU_ITEMS);

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toHaveLength(MOCK_MENU_ITEMS.length);
    expect(result.current.error).toBeNull();
  });

  it("returns first item matching mock data", async () => {
    mockLoadMenu.mockResolvedValue(MOCK_MENU_ITEMS);

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items[0].id).toBe(MOCK_MENU_ITEMS[0].id);
    expect(result.current.items[0].title).toBe(MOCK_MENU_ITEMS[0].title);
  });

  it("sets error and clears items when load fails", async () => {
    mockLoadMenu.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });
});

describe("useMenuByAccountType", () => {
  it("starts in loading state with empty items", () => {
    mockLoadMenuByAccountType.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useMenuByAccountType("REGULAR"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it("returns REGULAR menu items after successful load", async () => {
    const regular = MOCK_MENU_ITEMS.filter((m) => m.type === "REGULAR");
    mockLoadMenuByAccountType.mockResolvedValue(regular);

    const { result } = renderHook(() => useMenuByAccountType("REGULAR"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toHaveLength(regular.length);
    expect(result.current.error).toBeNull();
  });

  it("returns PREMIUM menu items after successful load", async () => {
    const premium = MOCK_MENU_ITEMS.filter((m) => m.type === "PREMIUM");
    mockLoadMenuByAccountType.mockResolvedValue(premium);

    const { result } = renderHook(() => useMenuByAccountType("PREMIUM"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toHaveLength(premium.length);
  });

  it("resets to loading when accountType changes", async () => {
    const regular = MOCK_MENU_ITEMS.filter((m) => m.type === "REGULAR");
    const premium = MOCK_MENU_ITEMS.filter((m) => m.type === "PREMIUM");

    mockLoadMenuByAccountType
      .mockResolvedValueOnce(regular)
      .mockResolvedValueOnce(premium);

    const { result, rerender } = renderHook(
      ({ type }: { type: "REGULAR" | "PREMIUM" }) => useMenuByAccountType(type),
      { initialProps: { type: "REGULAR" } },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(regular.length);

    rerender({ type: "PREMIUM" });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(premium.length);
  });

  it("sets error when load fails", async () => {
    mockLoadMenuByAccountType.mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useMenuByAccountType("REGULAR"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.items).toEqual([]);
  });
});
