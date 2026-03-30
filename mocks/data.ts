import type { Branch, ExchangeRate, InterestRate } from "@/features/search/types";

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
  { id: "1", name: "Bank 1656 Union Street", distance: "50m", latitude: -6.2, longitude: 106.816 },
  { id: "2", name: "Bank Secaucus", distance: "1,2 km", latitude: -6.205, longitude: 106.82 },
  { id: "3", name: "Bank 1657 Riverside Drive", distance: "5,3 km", latitude: -6.195, longitude: 106.825 },
  { id: "4", name: "Bank Rutherford", distance: "70m", latitude: -6.21, longitude: 106.812 },
  { id: "5", name: "Bank 1656 Union Street", distance: "30m", latitude: -6.208, longitude: 106.814 },
];
