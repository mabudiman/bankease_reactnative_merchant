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

// Preset gradients for ghost layers (layer 1 = middle, layer 2 = back)
const GHOST_GRADIENTS: [string, string, string][] = [
  ['#FF4267', '#FF4267', '#FF4267'], // card kedua — middle layer
  ['#5655B9', '#5655B9', '#5655B9'], // card ketiga — back layer
];

export function AccountCardCarousel({ cards }: AccountCardCarouselProps) {
  // Always show 3 stacked layers for visual depth; pad with ghost copies if needed
  const front = cards[0];
  const layers: PaymentCard[] = front
    ? [
        front,
        cards[1] ?? { ...front, id: `${front.id}-ghost-1`, gradientColors: GHOST_GRADIENTS[0] },
        cards[2] ?? { ...front, id: `${front.id}-ghost-2`, gradientColors: GHOST_GRADIENTS[1] },
      ]
    : [];
  const depth = layers.length; // 0 or 3
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
        /* istanbul ignore next -- logicalIdx is always 0/1/2 so fallback is unreachable */
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

