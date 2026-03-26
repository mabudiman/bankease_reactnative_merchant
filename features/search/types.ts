import type { ImageSourcePropType } from "react-native";

export type SearchCategory = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  illustration: ImageSourcePropType;
  bgColor: string;
};
