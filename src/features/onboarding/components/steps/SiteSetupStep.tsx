import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';

type SiteType = 'office' | 'home' | 'retail';

interface SiteTypeConfig {
  type: SiteType;
  iconName: string;
  symbol: string;
}

const SITE_TYPES: SiteTypeConfig[] = [
  { type: 'office', iconName: 'briefcase',    symbol: 'building.2' },
  { type: 'home',   iconName: 'home',         symbol: 'house' },
  { type: 'retail', iconName: 'shopping-bag', symbol: 'cart' },
];

export function SiteSetupStep({ onNext, onBack, data, isFirst }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [siteName, setSiteName] = useState<string>(data.siteName ?? '');
  const [address, setAddress]   = useState<string>(data.siteAddress ?? '');
  const [siteType, setSiteType] = useState<SiteType | ''>(data.siteType ?? '');

  const canProceed = siteName.trim() && siteType;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ siteName: siteName.trim(), siteAddress: address.trim(), siteType });
  };

  const inputStyle = [
    styles.input,
    { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Step icon */}
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryContainer }]}>
        <AppIcon type="Feather" name="map-pin" symbol="mappin" size={28} color={theme.primary} />
      </View>

      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface, marginTop: spacing.md }]}>
        {t('siteSetup.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('siteSetup.description')}
      </Text>

      <View style={styles.form}>
        {/* Site name */}
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('siteSetup.siteName')}</Text>
        <TextInput
          style={inputStyle}
          value={siteName}
          onChangeText={setSiteName}
          placeholder={t('siteSetup.siteNamePlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
          returnKeyType="next"
        />

        {/* Address */}
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('siteSetup.address')}</Text>
        <TextInput
          style={inputStyle}
          value={address}
          onChangeText={setAddress}
          placeholder={t('siteSetup.addressPlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
          returnKeyType="done"
        />

        {/* Site type */}
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('siteSetup.siteType')}</Text>
        <View style={styles.typeRow}>
          {SITE_TYPES.map(({ type, iconName, symbol }) => {
            const selected = siteType === type;
            return (
              <Pressable
                key={type}
                onPress={() => setSiteType(type)}
                android_ripple={{ color: 'rgba(245,158,11,0.12)' }}
                style={({ pressed }) => [
                  styles.typeCard,
                  {
                    borderColor: selected ? theme.primary : theme.outline,
                    backgroundColor: selected
                      ? theme.primaryContainer
                      : Platform.OS === 'ios' && pressed
                      ? theme.surfaceVariant
                      : theme.surface,
                  },
                ]}
              >
                <AppIcon
                  type="Feather"
                  name={iconName}
                  symbol={symbol}
                  size={24}
                  color={selected ? theme.primary : theme.onSurfaceVariant}
                />
                <Text
                  style={[
                    typography.variants.labelMedium,
                    { color: selected ? theme.onPrimaryContainer : theme.onSurface, marginTop: spacing.xs },
                  ]}
                >
                  {t(`siteSetup.types.${type}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Navigation buttons */}
      <View style={styles.btnRow}>
        {!isFirst && (
          <Pressable
            onPress={onBack}
            android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
            style={({ pressed }) => [
              styles.btn,
              styles.backBtn,
              { borderColor: theme.outline, opacity: Platform.OS === 'ios' && pressed ? 0.7 : 1 },
            ]}
          >
            <AppIcon type="Feather" name="arrow-left" symbol="arrow.left" size={16} color={theme.onSurface} />
            <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
              {t('common.back')}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
          style={({ pressed }) => [
            styles.btn,
            styles.nextBtn,
            {
              backgroundColor: theme.primary,
              opacity: canProceed ? (Platform.OS === 'ios' && pressed ? 0.8 : 1) : 0.4,
            },
          ]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('common.next')}
          </Text>
          <AppIcon type="Feather" name="arrow-right" symbol="arrow.right" size={16} color={theme.onPrimary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: { marginTop: spacing.lg, gap: spacing.xs },
  label: {
    ...typography.variants.labelMedium,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...typography.variants.bodyMedium,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 80,
    justifyContent: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 52,
    borderRadius: borderRadius.md,
  },
  backBtn: {
    flex: 1,
    borderWidth: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
