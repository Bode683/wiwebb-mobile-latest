import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';

const CHECK = '\u2713';

export function SuccessStep({ onNext }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const items = [
    t('success.orgCreated'),
    t('success.siteConfigured'),
    t('success.devicesClaimed'),
    t('success.wifiConfigured'),
  ];

  return (
    <View style={styles.container}>
      <Text style={[typography.variants.titleLarge, { color: theme.onSurface, textAlign: 'center' }]}>
        {t('success.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs }]}>
        {t('success.description')}
      </Text>

      <View style={styles.summaryList}>
        {items.map((item, i) => (
          <View key={i} style={styles.summaryRow}>
            <View style={[styles.checkCircle, { backgroundColor: theme.primaryContainer }]}>
              <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 16 }}>{CHECK}</Text>
            </View>
            <Text style={[typography.variants.bodyMedium, { color: theme.onSurface }]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.primaryContainer, borderColor: theme.primary }]}>
        <Text style={[typography.variants.bodySmall, { color: theme.onPrimaryContainer }]}>
          {t('success.info')}
        </Text>
      </View>

      <View style={styles.spacer} />

      <Pressable
        onPress={() => onNext()}
        style={[styles.btn, { backgroundColor: theme.primary }]}
      >
        <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
          {t('success.goToDashboard')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryList: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  spacer: { flex: 1 },
  btn: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});
