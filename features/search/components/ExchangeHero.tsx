import { Image, StyleSheet } from "react-native";
import { Spacing } from "@/constants/theme";

const source = require("@/assets/images/illustrations/exchange-illustration.png");

export function ExchangeHero() {
  return <Image source={source} style={styles.hero} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  hero: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
});
