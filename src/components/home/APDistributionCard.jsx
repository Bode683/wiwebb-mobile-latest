import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

// Proportional to design widths: 40, 50, 60, 80, fill_container (96)
const SEGMENTS = [
  { color: '#EF4444', flex: 40 },
  { color: '#F59E0B', flex: 50 },
  { color: '#EAB308', flex: 60 },
  { color: '#84CC16', flex: 80 },
  { color: '#22C55E', flex: 96 },
];

const LABELS = ['-90', '-70', '-60', '-50', '-30'];

export const APDistributionCard = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
      <Text style={[styles.title, { color: theme.onSurface }]}>AP Distribution</Text>
      <Text style={[styles.subtitle, { color: theme.onSurfaceVariant }]}>12 APs connected</Text>
      <View style={styles.bar}>
        {SEGMENTS.map((seg, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: seg.color, flex: seg.flex },
              i === 0 && styles.segmentFirst,
              i === SEGMENTS.length - 1 && styles.segmentLast,
            ]}
          />
        ))}
      </View>
      <View style={styles.labelsRow}>
        {LABELS.map((l) => (
          <Text key={l} style={[styles.label, { color: theme.onSurfaceVariant }]}>{l}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: -4,
  },
  bar: {
    flexDirection: 'row',
    height: 12,
    overflow: 'hidden',
    borderRadius: 4,
  },
  segment: {
    height: '100%',
  },
  segmentFirst: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  segmentLast: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
  },
});
