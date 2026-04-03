import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

const SUCCESS = '#059669';
const TABS = ['Traffic', 'Clients'];

const DATA = {
  Traffic: [
    { name: 'Office-WiFi-5G',  value: '12.4 GB', pct: 0.86 },
    { name: 'Guest-Network',   value: '8.7 GB',  pct: 0.60 },
    { name: 'IoT-Devices',     value: '5.2 GB',  pct: 0.36 },
    { name: 'Conference-Room', value: '2.9 GB',  pct: 0.20 },
  ],
  Clients: [
    { name: 'Office-WiFi-5G',  value: '34', pct: 0.76 },
    { name: 'Guest-Network',   value: '18', pct: 0.40 },
    { name: 'IoT-Devices',     value: '12', pct: 0.27 },
    { name: 'Conference-Room', value: '8',  pct: 0.18 },
  ],
};

const BarRow = ({ item, theme }) => (
  <View style={styles.barRow}>
    <View style={styles.barHeader}>
      <Text style={[styles.barName, { color: theme.onSurface }]}>{item.name}</Text>
      <Text style={[styles.barValue, { color: SUCCESS }]}>{item.value}</Text>
    </View>
    <View style={[styles.barTrack, { backgroundColor: theme.secondary }]}>
      <View style={[styles.barFill, { backgroundColor: SUCCESS, width: `${item.pct * 100}%` }]} />
    </View>
  </View>
);

export const ActiveSSIDsCard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Traffic');

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.onSurface }]}>Most Active SSIDs</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.seeAll, { color: SUCCESS }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { backgroundColor: theme.secondary }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { backgroundColor: theme.surface }]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? theme.onSurface : theme.onSurfaceVariant },
                activeTab === tab && { fontWeight: '600' },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.data}>
        {DATA[activeTab].map((item) => (
          <BarRow key={item.name} item={item} theme={theme} />
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
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 8,
    padding: 3,
    gap: 2,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
  },
  data: {
    gap: 10,
  },
  barRow: {
    gap: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barName: {
    fontSize: 11,
    fontWeight: '500',
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
});
