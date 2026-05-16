import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { selectWifiConfigs } from '../../features/onboarding/slice/onboardingSlice';
import { useTheme } from '../../theme';
import { AppIcon } from '../AppIcon';
import { WifiShareSheet } from './WifiShareSheet';

const SUCCESS = '#059669';
const TABS = ['Traffic', 'Clients'];

const MOCK_DATA = {
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

const BarRow = ({ item, theme, onShare }) => (
  <View style={styles.barRow}>
    <View style={styles.barHeader}>
      <View style={styles.nameRow}>
        {item.pinned && (
          <AppIcon
            type="MaterialIcons"
            name="push-pin"
            symbol="pin.fill"
            size={11}
            color={theme.primary}
          />
        )}
        <Text style={[styles.barName, { color: theme.onSurface }]} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={[styles.barValue, { color: SUCCESS }]}>{item.value}</Text>
        {item.shareable && (
          <TouchableOpacity
            onPress={() => onShare(item)}
            hitSlop={10}
            activeOpacity={0.7}
            style={styles.shareBtn}
          >
            <AppIcon
              type="Feather"
              name="share-2"
              symbol="square.and.arrow.up"
              size={14}
              color={theme.onSurfaceVariant}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
    <View style={[styles.barTrack, { backgroundColor: theme.secondary }]}>
      <View style={[styles.barFill, { backgroundColor: SUCCESS, width: `${item.pct * 100}%` }]} />
    </View>
  </View>
);

export const ActiveSSIDsCard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Traffic');
  const [shareTarget, setShareTarget] = useState(null);

  const wifiConfigs = useAppSelector(selectWifiConfigs);

  const rows = useMemo(() => {
    const base = MOCK_DATA[activeTab];
    if (!wifiConfigs?.length) return base;

    // Convert stored configs to pinned rows. First config takes the top spot's mock metrics.
    const placeholder = base[0];
    const pinned = wifiConfigs.map((cfg, idx) => ({
      name: cfg.ssid,
      value: idx === 0 ? placeholder.value : activeTab === 'Traffic' ? '—' : '0',
      pct: idx === 0 ? placeholder.pct : 0,
      pinned: true,
      shareable: cfg.shareable,
      password: cfg.password,
      securityType: cfg.securityType,
    }));

    const pinnedSsids = new Set(pinned.map((p) => p.name));
    const rest = base.filter((b) => !pinnedSsids.has(b.name));
    return [...pinned, ...rest];
  }, [activeTab, wifiConfigs]);

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
        {rows.map((item) => (
          <BarRow key={item.name} item={item} theme={theme} onShare={setShareTarget} />
        ))}
      </View>

      <WifiShareSheet
        visible={!!shareTarget}
        network={
          shareTarget
            ? {
                ssid: shareTarget.name,
                password: shareTarget.password,
                securityType: shareTarget.securityType,
              }
            : null
        }
        onClose={() => setShareTarget(null)}
      />
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
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareBtn: {
    padding: 2,
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
