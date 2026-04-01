import { getMenu, getMenuByAccountType } from "../index";
import { request } from "@/core/api/client";
import type { MenuItem } from "../../types";

// Mock the API client to avoid real HTTP requests (no MSW handler for /api/menu)
jest.mock("@/core/api/client", () => ({
  request: jest.fn(),
}));

const mockRequest = request as jest.Mock;

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

describe("getMenu", () => {
  beforeEach(() => {
    mockRequest.mockResolvedValue({ menus: MOCK_MENU_ITEMS });
  });

  it("returns all menu items", async () => {
    const result = await getMenu();
    expect(result).toHaveLength(MOCK_MENU_ITEMS.length);
  });

  it("each item has required fields", async () => {
    const result = await getMenu();
    for (const item of result) {
      expect(item).toMatchObject({
        id: expect.any(String),
        index: expect.any(Number),
        type: expect.stringMatching(/^(REGULAR|PREMIUM)$/),
        title: expect.any(String),
        icon_url: expect.any(String),
        is_active: expect.any(Boolean),
      });
    }
  });

  it("calls the correct endpoint", async () => {
    await getMenu();
    expect(mockRequest).toHaveBeenCalledWith("/api/menu");
  });

  it("returns first item matching mock data", async () => {
    const result = await getMenu();
    expect(result[0]).toMatchObject({
      id: MOCK_MENU_ITEMS[0].id,
      title: MOCK_MENU_ITEMS[0].title,
    });
  });

  it("extracts items from the menus wrapper key", async () => {
    mockRequest.mockResolvedValue({ menus: [MOCK_MENU_ITEMS[0]] });
    const result = await getMenu();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe(MOCK_MENU_ITEMS[0].id);
  });
});

describe("getMenuByAccountType", () => {
  it("returns menu items for REGULAR account type", async () => {
    const regular = MOCK_MENU_ITEMS.filter((m) => m.type === "REGULAR");
    mockRequest.mockResolvedValue({ menus: regular });

    const result = await getMenuByAccountType("REGULAR");
    expect(result).toHaveLength(regular.length);
    for (const item of result) {
      expect(item.type).toBe("REGULAR");
    }
  });

  it("returns menu items for PREMIUM account type", async () => {
    const premium = MOCK_MENU_ITEMS.filter((m) => m.type === "PREMIUM");
    mockRequest.mockResolvedValue({ menus: premium });

    const result = await getMenuByAccountType("PREMIUM");
    expect(result).toHaveLength(premium.length);
    for (const item of result) {
      expect(item.type).toBe("PREMIUM");
    }
  });

  it("calls the correct endpoint with REGULAR", async () => {
    mockRequest.mockResolvedValue({ menus: [] });
    await getMenuByAccountType("REGULAR");
    expect(mockRequest).toHaveBeenCalledWith("/api/menu/REGULAR");
  });

  it("calls the correct endpoint with PREMIUM", async () => {
    mockRequest.mockResolvedValue({ menus: [] });
    await getMenuByAccountType("PREMIUM");
    expect(mockRequest).toHaveBeenCalledWith("/api/menu/PREMIUM");
  });

  it("returns empty array when no items match", async () => {
    mockRequest.mockResolvedValue({ menus: [] });
    const result = await getMenuByAccountType("REGULAR");
    expect(result).toHaveLength(0);
  });
});
