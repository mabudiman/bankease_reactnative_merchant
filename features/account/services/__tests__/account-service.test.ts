import { menuService } from "../index";
import type { MenuItem } from "../../types";

// Mock menuApi to avoid real HTTP requests (no MSW handler for /api/menu)
jest.mock("@/features/account/api", () => ({
  menuApi: {
    getMenu: jest.fn(),
    getMenuByAccountType: jest.fn(),
  },
}));

// Import after mock so we get the mocked version
import { menuApi } from "@/features/account/api";

const mockMenuApi = menuApi as jest.Mocked<typeof menuApi>;

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
    type: "PREMIUM",
    title: "Investment",
    icon_url: "icon3.png",
    is_active: true,
  },
];

describe("menuService.loadMenu", () => {
  it("delegates to menuApi.getMenu and returns the result", async () => {
    mockMenuApi.getMenu.mockResolvedValue(MOCK_MENU_ITEMS);

    const result = await menuService.loadMenu();

    expect(result).toEqual(MOCK_MENU_ITEMS);
    expect(mockMenuApi.getMenu).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when API returns no items", async () => {
    mockMenuApi.getMenu.mockResolvedValue([]);

    const result = await menuService.loadMenu();

    expect(result).toEqual([]);
  });

  it("propagates errors thrown by menuApi.getMenu", async () => {
    mockMenuApi.getMenu.mockRejectedValue(new Error("Network error"));

    await expect(menuService.loadMenu()).rejects.toThrow("Network error");
  });
});

describe("menuService.loadMenuByAccountType", () => {
  it("delegates to menuApi.getMenuByAccountType with REGULAR", async () => {
    const regular = MOCK_MENU_ITEMS.filter((m) => m.type === "REGULAR");
    mockMenuApi.getMenuByAccountType.mockResolvedValue(regular);

    const result = await menuService.loadMenuByAccountType("REGULAR");

    expect(result).toEqual(regular);
    expect(mockMenuApi.getMenuByAccountType).toHaveBeenCalledWith("REGULAR");
  });

  it("delegates to menuApi.getMenuByAccountType with PREMIUM", async () => {
    const premium = MOCK_MENU_ITEMS.filter((m) => m.type === "PREMIUM");
    mockMenuApi.getMenuByAccountType.mockResolvedValue(premium);

    const result = await menuService.loadMenuByAccountType("PREMIUM");

    expect(result).toEqual(premium);
    expect(mockMenuApi.getMenuByAccountType).toHaveBeenCalledWith("PREMIUM");
  });

  it("returns empty array when API returns no items", async () => {
    mockMenuApi.getMenuByAccountType.mockResolvedValue([]);

    const result = await menuService.loadMenuByAccountType("REGULAR");

    expect(result).toEqual([]);
  });

  it("propagates errors thrown by menuApi.getMenuByAccountType", async () => {
    mockMenuApi.getMenuByAccountType.mockRejectedValue(new Error("Server error"));

    await expect(menuService.loadMenuByAccountType("REGULAR")).rejects.toThrow(
      "Server error",
    );
  });
});
