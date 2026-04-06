import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

type Session = {
  id: string;
  device: string;
  subtitle: string;
  isCurrent: boolean;
};

const SESSIONS: Session[] = [
  { id: '1', device: 'iPhone 15 Pro - Current', subtitle: 'Active now', isCurrent: true },
  { id: '2', device: 'MacBook Pro - Chrome', subtitle: '2 hours ago', isCurrent: false },
];

export default function SecurityScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');
  const [biometric, setBiometric] = useState(true);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);

  const revokeSession = (id: string) =>
    setSessions(prev => prev.filter(s => s.id !== id));

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Authentication */}
      <Text style={s.sectionHeader}>
        {t('security.sections.authentication').toUpperCase()}
      </Text>
      <View style={s.card}>
        <TouchableOpacity style={s.row} activeOpacity={0.7}>
          <AppIcon
            type="Feather"
            name="key"
            symbol="key"
            size={20}
            color={theme.onSurfaceVariant}
          />
          <Text style={s.rowLabel}>{t('security.changePassword')}</Text>
          <AppIcon
            type="Feather"
            name="chevron-right"
            symbol="chevron.right"
            size={18}
            color={theme.onSurfaceVariant}
          />
        </TouchableOpacity>
        <View style={[s.row, s.rowBorder]}>
          <AppIcon
            type="Feather"
            name="lock"
            symbol="lock"
            size={20}
            color={theme.onSurfaceVariant}
          />
          <Text style={s.rowLabel}>{t('security.biometricLogin')}</Text>
          <Switch
            value={biometric}
            onValueChange={setBiometric}
            trackColor={{ false: theme.outline, true: '#f59e0b' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Active Sessions */}
      <Text style={s.sectionHeader}>
        {t('security.sections.activeSessions').toUpperCase()}
      </Text>
      <View style={s.card}>
        {sessions.map((session, i) => (
          <View key={session.id} style={[s.sessionRow, i > 0 && s.rowBorder]}>
            {/* Left: device name + subtitle */}
            <View style={s.sessionInfo}>
              <Text style={s.sessionDevice}>{session.device}</Text>
              <Text
                style={[
                  s.sessionSubtitle,
                  session.isCurrent && s.sessionSubtitleActive,
                ]}
              >
                {session.subtitle}
              </Text>
            </View>

            {/* Right: green dot (current) or X (revoke) */}
            {session.isCurrent ? (
              <View style={s.activeDot} />
            ) : (
              <TouchableOpacity
                onPress={() => revokeSession(session.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AppIcon
                  type="Feather"
                  name="x"
                  symbol="xmark"
                  size={18}
                  color={theme.onSurfaceVariant}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Sign out other sessions */}
      <TouchableOpacity style={s.signOutButton} activeOpacity={0.7}>
        <Text style={s.signOutText}>{t('security.signOutOtherSessions')}</Text>
      </TouchableOpacity>
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    rowLabel: {
      flex: 1,
      fontSize: typography.sizes.md,
      color: theme.onSurface,
    },
    /* Session rows */
    sessionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    sessionInfo: {
      flex: 1,
    },
    sessionDevice: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.medium,
      color: theme.onSurface,
    },
    sessionSubtitle: {
      fontSize: typography.sizes.sm,
      color: theme.onSurfaceVariant,
      marginTop: 2,
    },
    sessionSubtitleActive: {
      color: '#22c55e',
    },
    activeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#22c55e',
    },
    /* Bottom button */
    signOutButton: {
      marginTop: spacing.xl,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    signOutText: {
      fontSize: typography.sizes.md,
      color: theme.onSurface,
    },
  });
