import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AccountCard, CARD_HEIGHT } from './AccountCard';
import type { PaymentCard } from '../types';

interface AccountCardCarouselProps {
  readonly cards: PaymentCard[];
}

// How many pixels each back layer peeks below the layer in front of it
const PEEK = 14;
// How many px each back layer is inset horizontally (makes it look narrower/behind)
const INSET_PER_LAYER = 10;

export function AccountCardCarousel({ cards }: AccountCardCarouselProps) {
  // Show at most 3 layers
  const layers = cards.slice(0, 3);
  const depth = layers.length; // 1, 2, or 3
  const containerHeight = CARD_HEIGHT + (depth - 1) * PEEK;

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Stacked layers: render back first */}
      {[...layers].reverse().map((card, renderIdx) => {
        const logicalIdx = depth - 1 - renderIdx; // 0 = front card
        const inset = logicalIdx * INSET_PER_LAYER;
        const topOffset = logicalIdx * PEEK;
        const zIndex = depth - logicalIdx; // front = highest z
        const LAYER_OPACITY = [1, 0.82, 0.62];
        const opacity = LAYER_OPACITY[logicalIdx] ?? 0.62;

        return (
          <View
            key={card.id}
            style={[
              styles.layerWrapper,
              { top: topOffset, left: inset, right: inset, zIndex, opacity },
            ]}
          >
            <AccountCard card={card} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 24,
    // Extra bottom space so shadow of front card isn't clipped
    marginBottom: 8,
  },
  layerWrapper: {
    position: 'absolute',
    // Card fills the wrapper width; AccountCard uses Dimensions so
    // we let it size itself — wrapper just controls positioning
    alignItems: 'center',
  },
});

