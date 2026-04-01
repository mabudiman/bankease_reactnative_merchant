import React, { memo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors } from "@/constants/theme";
import { formatCurrency } from "@/utils/money";
import type { PaymentCard } from "../types";
import VisaLogo from "@/assets/svgs/icon_visa.svg";

interface AccountCardProps {
  readonly card: PaymentCard;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = SCREEN_WIDTH - 48;
export const CARD_HEIGHT = 190;

function BrandLogo({ brand }: { readonly brand: PaymentCard["brand"] }) {
  if (brand === "VISA") {
    return <VisaLogo width={58} height={20} />;
  }
  // MASTERCARD: two overlapping circles
  return (
    <View style={styles.mcWrapper}>
      <View style={[styles.mcCircle, styles.mcRed]} />
      <View style={[styles.mcCircle, styles.mcOrange]} />
    </View>
  );
}

function AccountCardComponent({ card }: AccountCardProps) {
  return (
    <LinearGradient
      colors={card.gradientColors as [string, string, ...string[]]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.card}
    >
      <View style={styles.blobRight} />
      <View style={styles.blobRightOuter} />

      <View style={styles.content}>
        <ThemedText style={styles.holderName}>{card.holderName}</ThemedText>

        <ThemedText style={styles.cardLabel}>{card.cardLabel}</ThemedText>

        <ThemedText style={styles.maskedNumber}>{card.maskedNumber}</ThemedText>

        <View style={styles.bottomRow}>
          <ThemedText style={styles.balance}>
            {formatCurrency(card.balance, card.currency)}
          </ThemedText>
          <BrandLogo brand={card.brand} />
        </View>
      </View>
    </LinearGradient>
  );
}

export const AccountCard = memo(AccountCardComponent);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },

  holderName: {
    color: Colors.white,
    fontSize: 20,
  },

  cardLabel: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 30,
  },

  maskedNumber: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 1.2,
    marginTop: 6,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  balance: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },

  blobRight: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.13)',
    right: 20,
    top: '50%',
    marginTop: -80,
  },

  blobRightOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    right: -30,
    top: '50%',
    marginTop: -100,
  },

  mcWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mcCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.9,
  },

  mcRed: {
    backgroundColor: '#EB001B',
    marginRight: -10,
    zIndex: 1,
  },

  mcOrange: {
    backgroundColor: '#F79E1B',
  },
});
