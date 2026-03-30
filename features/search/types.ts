import type { ImageSourcePropType } from "react-native";

export type SearchCategory = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  illustration: ImageSourcePropType;
  bgColor: string;
};

export type ExchangeRate = {
  id: string;
  country: string;
  currency: string;
  countryCode: string;
  buy: number;
  sell: number;
};

export type InterestRate = {
  id: string;
  kind: "individual" | "corporate";
  deposit: string;
  rate: number;
};

export type Branch = {
  id: string;
  name: string;
  distance: string;
  latitude: number;
  longitude: number;
};
