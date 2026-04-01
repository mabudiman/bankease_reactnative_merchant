import type { Branch, ExchangeRate, InterestRate } from "@/features/search/types";
import type { Beneficiary } from "@/features/mobile-prepaid/types";
import type { MockAccount } from "@/features/withdraw/types";

export const MOCK_EXCHANGE_RATES: ExchangeRate[] = [
  { id: "1",  country: "Vietnam",  currency: "VND", countryCode: "VN", buy: 1.403, sell: 1.746  },
  { id: "2",  country: "Nicaragua", currency: "NIO", countryCode: "NI", buy: 9.123, sell: 12.09  },
  { id: "3",  country: "Korea",    currency: "KRW", countryCode: "KR", buy: 3.704, sell: 5.151  },
  { id: "4",  country: "Russia",   currency: "RUB", countryCode: "RU", buy: 116.0, sell: 144.4  },
  { id: "5",  country: "China",    currency: "CNY", countryCode: "CN", buy: 1.725, sell: 2.234  },
  { id: "6",  country: "Portugal", currency: "EUR", countryCode: "PT", buy: 1.403, sell: 1.746  },
  { id: "7",  country: "Korea",    currency: "KRW", countryCode: "KR", buy: 3.454, sell: 4.312  },
  { id: "8",  country: "France",   currency: "EUR", countryCode: "FR", buy: 23.45, sell: 34.56  },
  { id: "9",  country: "Nicaragua", currency: "NIO", countryCode: "NI", buy: 263.1, sell: 300.3  },
  { id: "10", country: "China",    currency: "CNY", countryCode: "CN", buy: 1.725, sell: 2.234  },
];

export const MOCK_INTEREST_RATES: InterestRate[] = [
  { id: "1", kind: "individual", deposit: "1m", rate: 4.5 },
  { id: "2", kind: "corporate", deposit: "2m", rate: 5.5 },
  { id: "3", kind: "individual", deposit: "1m", rate: 4.5 },
  { id: "4", kind: "corporate", deposit: "6m", rate: 2.5 },
  { id: "5", kind: "individual", deposit: "1m", rate: 4.5 },
  { id: "6", kind: "corporate", deposit: "8m", rate: 6.5 },
  { id: "7", kind: "individual", deposit: "1m", rate: 4.5 },
  { id: "8", kind: "individual", deposit: "1m", rate: 4.5 },
  { id: "9", kind: "corporate", deposit: "7m", rate: 6.8 },
  { id: "10", kind: "individual", deposit: "1m", rate: 4.5 },
  { id: "11", kind: "individual", deposit: "12m", rate: 5.9 },
  { id: "12", kind: "individual", deposit: "1m", rate: 4.5 },
];

export const MOCK_BRANCHES: Branch[] = [
  // Central Jakarta cluster
  { id: "1",  name: "BRI KCU Gambir",           distance: "120m",   latitude: -6.1763, longitude: 106.8227 },
  { id: "2",  name: "BRI KC Tanah Abang",        distance: "850m",   latitude: -6.1862, longitude: 106.8133 },
  { id: "3",  name: "BRI KC Menteng",            distance: "1,1 km", latitude: -6.1953, longitude: 106.8318 },

  // South Jakarta cluster
  { id: "4",  name: "BRI KC Kebayoran Baru",     distance: "3,2 km", latitude: -6.2432, longitude: 106.7966 },
  { id: "5",  name: "BRI KC Mampang Prapatan",   distance: "4,5 km", latitude: -6.2612, longitude: 106.8301 },
  { id: "6",  name: "BRI KCP Cilandak",          distance: "6,7 km", latitude: -6.2944, longitude: 106.7975 },

  // East Jakarta cluster
  { id: "7",  name: "BRI KC Jatinegara",         distance: "5,0 km", latitude: -6.2154, longitude: 106.8697 },
  { id: "8",  name: "BRI KCP Cakung",            distance: "9,3 km", latitude: -6.1982, longitude: 106.9326 },
  { id: "9",  name: "BRI KC Kramat Jati",        distance: "7,8 km", latitude: -6.2573, longitude: 106.8742 },

  // West Jakarta cluster
  { id: "10", name: "BRI KC Grogol",             distance: "4,1 km", latitude: -6.1671, longitude: 106.7893 },
  { id: "11", name: "BRI KCP Kebon Jeruk",       distance: "7,2 km", latitude: -6.1964, longitude: 106.7602 },
  { id: "12", name: "BRI KC Taman Sari",         distance: "2,6 km", latitude: -6.1476, longitude: 106.8132 },

  // North Jakarta cluster
  { id: "13", name: "BRI KC Tanjung Priok",      distance: "8,4 km", latitude: -6.1085, longitude: 106.8756 },
  { id: "14", name: "BRI KCP Penjaringan",       distance: "6,0 km", latitude: -6.1228, longitude: 106.7952 },
  { id: "15", name: "BRI KC Pluit",              distance: "7,5 km", latitude: -6.1154, longitude: 106.8013 },
];

/** Raw server response shape for profile API */
export const MOCK_PROFILE_API_RESPONSE = {
  id: "da08ecfe-de3b-42b1-b1ce-018e144198f5",
  bank: "BRI",
  branch: "Jakarta Pusat",
  name: "Demo Merchant",
  card_number: "1234567890123456",
  card_provider: "VISA",
  balance: 1500,
  currency: "IDR",
  accountType: "REGULAR",
  image: undefined as string | undefined,
};

/** Mapped UserProfile (after mapResponseToProfile) */
export const MOCK_USER_PROFILE = {
  accountId: "da08ecfe-de3b-42b1-b1ce-018e144198f5",
  bankName: "BRI",
  branchName: "Jakarta Pusat",
  transactionName: "Demo Merchant",
  cardNumber: "1234567890123456",
  cardProvider: "VISA",
  balance: 150000,   // 1500 * 100 (minor units)
  currency: "IDR",
  accountType: "REGULAR",
  image: undefined as string | undefined,
};

/** Mock accounts for withdraw/transfer flows */
export const MOCK_WITHDRAW_ACCOUNTS: MockAccount[] = [
  { id: "1", label: "1900 8988 5456" },
  { id: "2", label: "1900 8112 5222" },
  { id: "3", label: "4411 0000 1234" },
  { id: "4", label: "1900 8988 5457" },
  { id: "5", label: "1900 8988 5458" },
];
