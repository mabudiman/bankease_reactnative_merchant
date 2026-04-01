import type {
  Branch,
  CurrencyEntry,
  ExchangeRate,
  InterestRate,
} from "@/features/search/types";
import type { Provider, InternetBillDetail } from "@/features/payTheBill/types";
import type { Beneficiary } from "@/features/mobile-prepaid/types";
import type { PaymentCard } from "@/features/dashboard/types";

export const MOCK_EXCHANGE_RATES: ExchangeRate[] = [
  {
    id: "1",
    country: "Vietnam",
    currency: "VND",
    countryCode: "VN",
    buy: 1.403,
    sell: 1.746,
  },
  {
    id: "2",
    country: "Nicaragua",
    currency: "NIO",
    countryCode: "NI",
    buy: 9.123,
    sell: 12.09,
  },
  {
    id: "3",
    country: "Korea",
    currency: "KRW",
    countryCode: "KR",
    buy: 3.704,
    sell: 5.151,
  },
  {
    id: "4",
    country: "Russia",
    currency: "RUB",
    countryCode: "RU",
    buy: 116.0,
    sell: 144.4,
  },
  {
    id: "5",
    country: "China",
    currency: "CNY",
    countryCode: "CN",
    buy: 1.725,
    sell: 2.234,
  },
  {
    id: "6",
    country: "Portugal",
    currency: "EUR",
    countryCode: "PT",
    buy: 1.403,
    sell: 1.746,
  },
  {
    id: "7",
    country: "Korea",
    currency: "KRW",
    countryCode: "KR",
    buy: 3.454,
    sell: 4.312,
  },
  {
    id: "8",
    country: "France",
    currency: "EUR",
    countryCode: "FR",
    buy: 23.45,
    sell: 34.56,
  },
  {
    id: "9",
    country: "Nicaragua",
    currency: "NIO",
    countryCode: "NI",
    buy: 263.1,
    sell: 300.3,
  },
  {
    id: "10",
    country: "China",
    currency: "CNY",
    countryCode: "CN",
    buy: 1.725,
    sell: 2.234,
  },
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
  {
    id: "1",
    name: "BRI KCU Gambir",
    distance: "120m",
    latitude: -6.1763,
    longitude: 106.8227,
  },
  {
    id: "2",
    name: "BRI KC Tanah Abang",
    distance: "850m",
    latitude: -6.1862,
    longitude: 106.8133,
  },
  {
    id: "3",
    name: "BRI KC Menteng",
    distance: "1,1 km",
    latitude: -6.1953,
    longitude: 106.8318,
  },

  // South Jakarta cluster
  {
    id: "4",
    name: "BRI KC Kebayoran Baru",
    distance: "3,2 km",
    latitude: -6.2432,
    longitude: 106.7966,
  },
  {
    id: "5",
    name: "BRI KC Mampang Prapatan",
    distance: "4,5 km",
    latitude: -6.2612,
    longitude: 106.8301,
  },
  {
    id: "6",
    name: "BRI KCP Cilandak",
    distance: "6,7 km",
    latitude: -6.2944,
    longitude: 106.7975,
  },

  // East Jakarta cluster
  {
    id: "7",
    name: "BRI KC Jatinegara",
    distance: "5,0 km",
    latitude: -6.2154,
    longitude: 106.8697,
  },
  {
    id: "8",
    name: "BRI KCP Cakung",
    distance: "9,3 km",
    latitude: -6.1982,
    longitude: 106.9326,
  },
  {
    id: "9",
    name: "BRI KC Kramat Jati",
    distance: "7,8 km",
    latitude: -6.2573,
    longitude: 106.8742,
  },

  // West Jakarta cluster
  {
    id: "10",
    name: "BRI KC Grogol",
    distance: "4,1 km",
    latitude: -6.1671,
    longitude: 106.7893,
  },
  {
    id: "11",
    name: "BRI KCP Kebon Jeruk",
    distance: "7,2 km",
    latitude: -6.1964,
    longitude: 106.7602,
  },
  {
    id: "12",
    name: "BRI KC Taman Sari",
    distance: "2,6 km",
    latitude: -6.1476,
    longitude: 106.8132,
  },

  // North Jakarta cluster
  {
    id: "13",
    name: "BRI KC Tanjung Priok",
    distance: "8,4 km",
    latitude: -6.1085,
    longitude: 106.8756,
  },
  {
    id: "14",
    name: "BRI KCP Penjaringan",
    distance: "6,0 km",
    latitude: -6.1228,
    longitude: 106.7952,
  },
  {
    id: "15",
    name: "BRI KC Pluit",
    distance: "7,5 km",
    latitude: -6.1154,
    longitude: 106.8013,
  },
];

export const CURRENCY_LIST: CurrencyEntry[] = [
  { code: "AUD", label: "AUD (Australian Dollar)", rate: 1.53 },
  { code: "CNY", label: "CNY (Chinese Yuan)", rate: 7.24 },
  { code: "EUR", label: "EUR (Euro)", rate: 0.92 },
  { code: "GBP", label: "GBP (British Pound Sterling)", rate: 0.79 },
  { code: "IDR", label: "IDR (Indonesian Rupiah)", rate: 16350 },
  { code: "JPY", label: "JPY (Japanese Yen)", rate: 149.5 },
  { code: "MYR", label: "MYR (Malaysian Ringgit)", rate: 4.72 },
  { code: "SAR", label: "SAR (Saudi Riyal)", rate: 3.75 },
  { code: "SGD", label: "SGD (Singapore Dollar)", rate: 1.34 },
  { code: "USD", label: "USD (United States Dollar)", rate: 1 },
];

export const INTERNET_BILL_DETAIL: InternetBillDetail = {
  customerId: "#2345641ASS",
  name: "Jackson Maine",
  address: "403 East 4th Street, Santa Ana",
  phoneNumber: "+8424599721",
  code: "#2345641",
  from: "01/09/2019",
  to: "01/10/2019",
  internetFee: "$50",
  tax: "$0",
  total: "$50",
};

export const MOCK_PROVIDERS: Provider[] = [
  { id: "1", name: "Biznet" },
  { id: "2", name: "Indihome" },
  { id: "3", name: "MyRepublic" },
  { id: "4", name: "XL Home" },
  { id: "5", name: "CBN" },
  { id: "6", name: "First Media" },
];

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: "1", name: "Alice Johnson", phone: "+1 234 567 8901" },
  { id: "2", name: "Bob Smith", phone: "+1 234 567 8902" },
  { id: "3", name: "Carol White", phone: "+1 234 567 8903" },
  { id: "4", name: "David Brown", phone: "+1 234 567 8904" },
  { id: "5", name: "Eve Davis", phone: "+1 234 567 8905" },
];

export const MOCK_PAYMENT_CARDS: PaymentCard[] = [
  {
    id: "card-001",
    accountId: "demo-001",
    holderName: "Jackson Maine",
    cardLabel: "BankEase Platinum",
    maskedNumber: "4532  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  7890",
    balance: 250000,
    currency: "USD",
    brand: "VISA",
    gradientColors: ["#1A1563", "#1E2FA0", "#3B7ED4"],
  },
  {
    id: "card-002",
    accountId: "demo-001",
    holderName: "Jackson Maine",
    cardLabel: "BankEase Gold",
    maskedNumber: "5412  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  3344",
    balance: 125000,
    currency: "USD",
    brand: "MASTERCARD",
    gradientColors: ["#2D1B69", "#5B2D8E", "#8E4EC6"],
  },
];
