import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

const TABS = ['Switches', 'APs', 'Clients'];

const DATA = {
  Switches: [
    { name: 'Switch-Core-01',   value: '4.2 GB', pct: 0.86 },
    { name: 'Switch-Floor2-03', value: '3.1 GB', pct: 0.63 },
    { name: 'Switch-Lobby-02',  value: '2.7 GB', pct: 0.55 },
    { name: 'Switch-IT-04',     value: '1.8 GB', pct: 0.37 },
    { name: 'Switch-Conf-05',   value: '0.9 GB', pct: 0.18 },
  ],
  APs: [
    { name: 'AP-Office-01',  value: '3.8 GB', pct: 0.78 },
    { name: 'AP-Lobby-02',   value: '2.9 GB', pct: 0.59 },
    { name: 'AP-Meeting-03', value: '2.1 GB', pct: 0.43 },
    { name: 'AP-Floor2-04',  value: '1.5 GB', pct: 0.31 },
    { name: 'AP-Ext-05',     value: '0.7 GB', pct: 0.14 },
  ],
  Clients: [
    { name: 'Client-PC-01',    value: '2.4 GB', pct: 0.72 },
    { name: 'Client-Mac-02',   value: '1.9 GB', pct: 0.57 },
    { name: 'Client-iOS-03',   value: '1.3 GB', pct: 0.39 },
    { name: 'Client-Win-04',   value: '0.9 GB', pct: 0.27 },
    { name: 'Client-Andr-05',  value: '0.4 GB', pct: 0.12 },
  ],
};

const BarRow = ({ item, theme }) => (
  <View style={styles.barRow}>
    <View style={styles.barHeader}>
      <Text style={[styles.barName, { color: theme.onSurface }]}>{item.name}</Text>
      <Text style={[styles.barValue, { color: theme.primary }]}>{item.value}</Text>
    </View>
    <View style={[styles.barTrack, { backgroundColor: theme.secondary }]}>
      <View style={[styles.barFill, { backgroundColor: theme.primary, width: `${item.pct * 100}%` }]} />
    </View>
  </View>
);

export const TrafficUsageCard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Switches');

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.onSurface }]}>Top 5 Traffic Usage</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
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

      <View style={styles.chart}>
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
  chart: {
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
