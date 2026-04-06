import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../theme';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

type AlertKey =
  | 'deviceOffline'
  | 'configFailure'
  | 'firmwareUpgrade'
  | 'certificateExpiry'
  | 'radiusBatch'
  | 'systemAlerts';

type AlertState = Record<AlertKey, boolean>;

const INITIAL_ALERTS: AlertState = {
  deviceOffline: true,
  configFailure: true,
  firmwareUpgrade: true,
  certificateExpiry: false,
  radiusBatch: true,
  systemAlerts: false,
};

const ALERT_KEYS: AlertKey[] = [
  'deviceOffline',
  'configFailure',
  'firmwareUpgrade',
  'certificateExpiry',
  'radiusBatch',
  'systemAlerts',
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [alerts, setAlerts] = useState<AlertState>(INITIAL_ALERTS);

  const toggleAlert = (key: AlertKey) =>
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Push Notifications */}
      <View style={s.card}>
        <View style={s.pushRow}>
          <View style={s.pushText}>
            <Text style={s.pushLabel}>{t('notifications.pushNotifications')}</Text>
            <Text style={s.pushSubtitle}>{t('notifications.pushSubtitle')}</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: theme.outline, true: '#f59e0b' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Alert Types */}
      <Text style={s.sectionHeader}>
        {t('notifications.sections.alertTypes').toUpperCase()}
      </Text>
      <View style={s.card}>
        {ALERT_KEYS.map((key, i) => (
          <View key={key} style={[s.alertRow, i > 0 && s.rowBorder]}>
            <Text style={s.alertLabel}>{t(`notifications.alerts.${key}`)}</Text>
            <Switch
              value={alerts[key]}
              onValueChange={() => toggleAlert(key)}
              trackColor={{ false: theme.outline, true: '#f59e0b' }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    sectionHeader: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.semibold,
      color: theme.onSurfaceVariant,
      letterSpacing: 0.8,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      overflow: 'hidden',
    },
    /* Push Notifications row */
    pushRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    pushText: {
      flex: 1,
      marginRight: spacing.md,
    },
    pushLabel: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.medium,
      color: theme.onSurface,
    },
    pushSubtitle: {
      fontSize: typography.sizes.sm,
      color: theme.onSurfaceVariant,
      marginTop: 2,
    },
    /* Alert type rows */
    alertRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    alertLabel: {
      flex: 1,
      fontSize: typography.sizes.md,
      color: theme.onSurface,
      marginRight: spacing.md,
    },
  });
