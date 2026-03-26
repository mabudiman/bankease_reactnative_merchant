import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import { formatCurrency } from '@/utils/money';
import type { PaymentCard } from '../types';
import VisaLogo from '@/assets/svgs/icon_visa.svg';

interface AccountCardProps {
  card: PaymentCard;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 48;
export const CARD_HEIGHT = 190;

function BrandLogo({ brand }: { brand: PaymentCard['brand'] }) {
  if (brand === 'VISA') {
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
      {/* Decorative blobs */}
      <View style={styles.blobRight} />
      <View style={styles.blobRightOuter} />

      {/* Top row: holder name + NFC icon */}
      <View style={styles.topRow}>
        <ThemedText style={styles.holderName}>{card.holderName}</ThemedText>
        <View style={styles.nfcIcon}>
          <View style={[styles.nfcArc, { width: 8, height: 14, borderRadius: 7 }]} />
          <View style={[styles.nfcArc, { width: 14, height: 20, borderRadius: 10 }]} />
          <View style={[styles.nfcArc, { width: 20, height: 26, borderRadius: 13 }]} />
        </View>
      </View>

      {/* Card label */}
      <ThemedText style={styles.cardLabel}>{card.cardLabel}</ThemedText>

      {/* Masked number */}
      <ThemedText style={styles.maskedNumber}>{card.maskedNumber}</ThemedText>

      {/* Bottom row: balance + brand logo */}
      <View style={styles.bottomRow}>
        <ThemedText style={styles.balance}>
          {formatCurrency(card.balance, card.currency)}
        </ThemedText>
        <BrandLogo brand={card.brand} />
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
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  // Decorative blobs (large semi-transparent circles on the right)
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holderName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  // NFC arcs (contactless symbol)
  nfcIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  nfcArc: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    marginTop: 2,
  },
  maskedNumber: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  // MASTERCARD logo
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
