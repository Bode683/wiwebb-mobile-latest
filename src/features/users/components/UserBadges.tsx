import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import type { Role } from '../../auth/rbac';

export function RoleBadge({ role }: { role: Role }) {
  const { t } = useTranslation('users');
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: theme.secondaryContainer ?? theme.surfaceVariant },
      ]}
    >
      <Text
        style={[
          typography.variants.labelSmall,
          { color: theme.onSecondaryContainer ?? theme.onSurfaceVariant },
        ]}
      >
        {t(`role.${role}`)}
      </Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: 'active' | 'pending' }) {
  const { t } = useTranslation('users');
  const { theme } = useTheme();
  const pending = status === 'pending';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: pending
            ? theme.errorContainer ?? theme.surfaceVariant
            : 'transparent',
          borderWidth: pending ? 0 : StyleSheet.hairlineWidth,
          borderColor: theme.outline,
        },
      ]}
    >
      <Text
        style={[
          typography.variants.labelSmall,
          {
            color: pending
              ? theme.onErrorContainer ?? theme.error
              : theme.onSurfaceVariant,
          },
        ]}
      >
        {t(`status.${status}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
});
