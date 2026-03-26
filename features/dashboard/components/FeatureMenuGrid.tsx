import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MenuGridItem } from './MenuGridItem';
import type { Privilege } from '../types';

interface FeatureMenuGridProps {
  privileges: Privilege[];
}

export function FeatureMenuGrid({ privileges }: FeatureMenuGridProps) {
  const enabled = privileges.filter((p) => p.enabled);

  // Split enabled privileges into rows of 3
  const rows: Privilege[][] = [];
  for (let i = 0; i < enabled.length; i += 3) {
    rows.push(enabled.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      {rows.map((row) => (
        <View key={row[0].code} style={styles.row}>
          {row.map((item) => (
            <View key={item.code} style={styles.cell}>
              <MenuGridItem privilege={item} />
            </View>
          ))}
          {/* Fill remaining cells in last row so items keep consistent width */}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, i) => (
              <View key={`${row[0].code}_pad_${i}`} style={styles.cell} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cell: {
    flex: 1,
  },
});

