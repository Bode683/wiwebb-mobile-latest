import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { AppIcon } from '../AppIcon';

const ROWS = [
  [
    { type: 'MaterialIcons', name: 'router',      symbol: 'wifi.router',       count: '2',  label: 'Gateway'  },
    { type: 'Feather',       name: 'wifi',         symbol: 'wifi',              count: '12', label: 'APs'      },
    { type: 'Feather',       name: 'server',       symbol: 'server.rack',       count: '8',  label: 'Switches' },
  ],
  [
    { type: 'Feather',       name: 'users',        symbol: 'person.2',          count: '45', label: 'Clients'  },
    { type: 'Feather',       name: 'camera',       symbol: 'camera',            count: '6',  label: 'IPCs'     },
    { type: 'Feather',       name: 'hard-drive',   symbol: 'internaldrive',     count: '3',  label: 'NVRs'     },
  ],
];

const StatCell = ({ item, theme }) => (
  <View style={styles.statCell}>
    <AppIcon
      type={item.type}
      name={item.name}
      symbol={item.symbol}
      size={32}
      color={theme.onSurfaceVariant}
    />
    <Text style={[styles.statCount, { color: theme.onSurface }]}>{item.count}</Text>
    <Text style={[styles.statLabel, { color: theme.onSurfaceVariant }]}>{item.label}</Text>
  </View>
);

export const DeviceSummaryCard = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
      {ROWS.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((item) => (
            <StatCell key={item.label} item={item} theme={theme} />
          ))}
        </View>
      ))}
      <TouchableOpacity
        style={[styles.topologyBtn, { backgroundColor: theme.primaryContainer }]}
        activeOpacity={0.8}
      >
        <AppIcon
          type="Feather"
          name="git-branch"
          symbol="arrow.triangle.branch"
          size={18}
          color={theme.primary}
        />
        <Text style={[styles.topologyText, { color: theme.primary }]}>Topology</Text>
      </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  topologyBtn: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  topologyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
