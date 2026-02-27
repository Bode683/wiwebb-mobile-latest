import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius, springPresets } from '../../../../theme';
import { PlatformIcon } from '../../../../components/PlatformIcon';

interface SummaryItem {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
}

export function SuccessStep({ onNext }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  // Entrance animation for the hero icon
  const heroScale   = useSharedValue(0.3);
  const heroOpacity = useSharedValue(0);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 300 });
    heroScale.value   = withSpring(1, springPresets.bouncy);
  }, [heroScale, heroOpacity]);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
    opacity: heroOpacity.value,
  }));

  const items: SummaryItem[] = [
    { icon: 'briefcase',  label: t('success.orgCreated') },
    { icon: 'map-pin',    label: t('success.siteConfigured') },
    { icon: 'cpu',        label: t('success.devicesClaimed') },
    { icon: 'wifi',       label: t('success.wifiConfigured') },
  ];

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.heroArea}>
        <Animated.View
          style={[styles.heroCircle, { backgroundColor: theme.primaryContainer }, heroStyle]}
        >
          <PlatformIcon
            feather="check-circle"
            symbol="checkmark.circle.fill"
            size={52}
            color={theme.primary}
          />
        </Animated.View>
      </View>

      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface, textAlign: 'center' }]}>
        {t('success.title')}
      </Text>
      <Text
        style={[
          typography.variants.bodyMedium,
          { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs },
        ]}
      >
        {t('success.description')}
      </Text>

      {/* Summary list */}
      <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        {items.map(({ icon, label }, i) => (
          <View
            key={i}
            style={[
              styles.summaryRow,
              i < items.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.outline },
            ]}
          >
            {/* Check circle */}
            <View style={[styles.checkWrap, { backgroundColor: theme.primaryContainer }]}>
              <Feather name="check" size={13} color={theme.primary} />
            </View>
            {/* Row icon */}
            <Feather name={icon} size={16} color={theme.onSurfaceVariant} />
            <Text style={[typography.variants.bodyMedium, { color: theme.onSurface, flex: 1 }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Info notice */}
      <View style={[styles.infoBox, { backgroundColor: theme.primaryContainer, borderColor: theme.primary }]}>
        <Feather name="info" size={15} color={theme.primary} style={{ marginTop: 2 }} />
        <Text style={[typography.variants.bodySmall, { color: theme.onPrimaryContainer, flex: 1 }]}>
          {t('success.info')}
        </Text>
      </View>

      <View style={styles.spacer} />

      {/* Go to Dashboard */}
      <Pressable
        onPress={() => onNext()}
        android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
        style={({ pressed }) => [
          styles.dashBtn,
          {
            backgroundColor: theme.primary,
            opacity: Platform.OS === 'ios' && pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
          {t('success.goToDashboard')}
        </Text>
        <PlatformIcon feather="arrow-right" symbol="arrow.right" size={17} color={theme.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroArea: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  checkWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  spacer: { flex: 1 },
  dashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
});
