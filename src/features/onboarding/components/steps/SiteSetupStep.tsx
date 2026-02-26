import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';

type SiteType = 'office' | 'home' | 'retail';

const SITE_TYPES: { type: SiteType; icon: string }[] = [
  { type: 'office', icon: '\uD83C\uDFE2' },
  { type: 'home', icon: '\uD83C\uDFE0' },
  { type: 'retail', icon: '\uD83D\uDED2' },
];

export function SiteSetupStep({ onNext, onBack, data, isFirst }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [siteName, setSiteName] = useState(data.siteName ?? '');
  const [address, setAddress] = useState(data.siteAddress ?? '');
  const [siteType, setSiteType] = useState<SiteType | ''>(data.siteType ?? '');

  const canProceed = siteName.trim() && siteType;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ siteName: siteName.trim(), siteAddress: address.trim(), siteType });
  };

  const inputStyle = [
    styles.input,
    { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[typography.variants.titleLarge, { color: theme.onSurface }]}>
        {t('siteSetup.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('siteSetup.description')}
      </Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('siteSetup.siteName')}</Text>
        <TextInput
          style={inputStyle}
          value={siteName}
          onChangeText={setSiteName}
          placeholder={t('siteSetup.siteNamePlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
        />

        <Text style={[styles.label, { color: theme.onSurface }]}>{t('siteSetup.address')}</Text>
        <TextInput
          style={inputStyle}
          value={address}
          onChangeText={setAddress}
          placeholder={t('siteSetup.addressPlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
        />

        <Text style={[styles.label, { color: theme.onSurface }]}>{t('siteSetup.siteType')}</Text>
        <View style={styles.typeRow}>
          {SITE_TYPES.map(({ type, icon }) => (
            <Pressable
              key={type}
              style={[
                styles.typeCard,
                {
                  borderColor: siteType === type ? theme.primary : theme.outline,
                  backgroundColor: siteType === type ? theme.primaryContainer : theme.surface,
                },
              ]}
              onPress={() => setSiteType(type)}
            >
              <Text style={styles.typeIcon}>{icon}</Text>
              <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>
                {t(`siteSetup.types.${type}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.btnRow}>
        {!isFirst && (
          <Pressable onPress={onBack} style={[styles.btn, styles.backBtn, { borderColor: theme.outline }]}>
            <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
              {t('common.back')}
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          style={[styles.btn, styles.nextBtn, { backgroundColor: theme.primary, opacity: canProceed ? 1 : 0.4 }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('common.next')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  form: { marginTop: spacing.lg, gap: spacing.sm },
  label: { ...typography.variants.labelMedium, marginTop: spacing.sm },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  typeCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeIcon: { fontSize: 24 },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  btn: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    flex: 1,
    borderWidth: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
