import type { Branch, ExchangeRate, InterestRate } from "@/features/search/types";
import type { Message, MessageThread } from "@/features/messages/types";

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

export const MOCK_MESSAGES: Message[] = [
  { id: "1", title: "Bank of America", preview: "Bank of America : 256486 is the au...", date: new Date().toISOString(), iconColor: "#3629B7", iconKey: "bank" },
  { id: "2", title: "Account",         preview: "Your account is limited. Please foll...", date: "2025-10-12T08:00:00.000Z", iconColor: "#E53935", iconKey: "person" },
  { id: "3", title: "Alert",           preview: "Your statement is ready for you to...", date: "2025-10-11T08:00:00.000Z", iconColor: "#1E88E5", iconKey: "alert" },
  { id: "4", title: "Paypal",          preview: "Your account has been locked. Ple...", date: "2025-11-10T08:00:00.000Z", iconColor: "#F6A800", iconKey: "paypal" },
  { id: "5", title: "Withdraw",        preview: "Dear customer, 2987456 is your co...", date: "2025-12-10T08:00:00.000Z", iconColor: "#52D5BA", iconKey: "withdraw" },
];

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  {
    id: "1",
    title: "Bank of America",
    messages: [
      { id: "m1", text: "Did you attempt transaction on debit card ending in 0000 at Mechan1 in NJ for $1,200? Reply YES or NO", type: "received", date: "2018-08-10T09:00:00.000Z" },
      { id: "m2", text: "Yes", type: "sent", date: "2018-08-10T09:05:00.000Z" },
      { id: "m3", text: "Bank of America : 256486 is your authorization code which expires in 10 minutes. If you didn't request the code. Call : 18009898 for assistance", type: "received", date: "2018-08-10T09:10:00.000Z" },
      { id: "m4", text: "Thanks!", type: "sent", date: "2018-08-10T09:15:00.000Z" },
    ],
  },
  {
    id: "2",
    title: "Account",
    messages: [
      { id: "m5a", text: "Welcome to BankEase! Your merchant account has been successfully created.", type: "received", date: "2025-09-01T08:00:00.000Z" },
      { id: "m5b", text: "Thank you! Excited to get started.", type: "sent", date: "2025-09-01T08:05:00.000Z" },
      { id: "m5c", text: "Your monthly statement for September 2025 is now available. You can view it in the app.", type: "received", date: "2025-10-01T09:00:00.000Z" },
      { id: "m5d", text: "Got it, thanks.", type: "sent", date: "2025-10-01T09:10:00.000Z" },
      { id: "m5e", text: "We noticed an unusual sign-in attempt on your account on 10 Oct 2025 at 03:22 AM. Was this you?", type: "received", date: "2025-10-10T06:00:00.000Z" },
      { id: "m5f", text: "No, that was not me.", type: "sent", date: "2025-10-10T06:05:00.000Z" },
      { id: "m5g", text: "We have blocked the suspicious login and secured your account. Please reset your password as a precaution.", type: "received", date: "2025-10-10T06:07:00.000Z" },
      { id: "m5h", text: "Done, I've just reset it.", type: "sent", date: "2025-10-10T06:15:00.000Z" },
      { id: "m5i", text: "Your account is limited. Please follow the instructions to restore full access.", type: "received", date: "2025-10-12T08:00:00.000Z" },
      { id: "m5j", text: "How do I restore access?", type: "sent", date: "2025-10-12T08:03:00.000Z" },
      { id: "m5k", text: "Please visit the nearest BRI branch with your ID and merchant registration documents to complete the verification process.", type: "received", date: "2025-10-12T08:05:00.000Z" },
      { id: "m5l", text: "Understood, I will go tomorrow.", type: "sent", date: "2025-10-12T08:08:00.000Z" },
      { id: "m5m", text: "Your account has been fully restored. Thank you for completing the verification.", type: "received", date: "2025-10-13T10:00:00.000Z" },
      { id: "m5n", text: "Great, thank you!", type: "sent", date: "2025-10-13T10:02:00.000Z" },
    ],
  },
  {
    id: "3",
    title: "Alert",
    messages: [
      { id: "m6", text: "Your statement is ready for you to view.", type: "received", date: "2025-10-11T08:00:00.000Z" },
    ],
  },
  {
    id: "4",
    title: "Paypal",
    messages: [
      { id: "m7", text: "Your account has been locked. Please contact support.", type: "received", date: "2025-11-10T08:00:00.000Z" },
    ],
  },
  {
    id: "5",
    title: "Withdraw",
    messages: [
      { id: "m8", text: "Dear customer, 2987456 is your code for the withdrawal.", type: "received", date: "2025-12-10T08:00:00.000Z" },
    ],
  },
];
