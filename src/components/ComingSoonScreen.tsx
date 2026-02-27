import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../theme';
import { PlatformIcon } from './PlatformIcon';

interface ComingSoonScreenProps {
  title: string;
  feather: React.ComponentProps<typeof PlatformIcon>['feather'];
  symbol: string;
}

/**
 * Shared placeholder screen for sections that are not yet implemented.
 * Each route file passes its own title and icon so the screen communicates
 * context without requiring unique screen code per route.
 */
export function ComingSoonScreen({ title, feather, symbol }: ComingSoonScreenProps) {
  const { t } = useTranslation('common');
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryContainer }]}>
        <PlatformIcon feather={feather} symbol={symbol} size={36} color={theme.primary} />
      </View>

      <Text style={[typography.variants.titleLarge, { color: theme.onSurface, marginTop: spacing.lg }]}>
        {title}
      </Text>

      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('comingSoon.label')}
      </Text>

      <Text
        style={[
          typography.variants.bodySmall,
          { color: theme.onSurfaceVariant, marginTop: spacing.sm, textAlign: 'center', maxWidth: 260 },
        ]}
      >
        {t('comingSoon.description')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
