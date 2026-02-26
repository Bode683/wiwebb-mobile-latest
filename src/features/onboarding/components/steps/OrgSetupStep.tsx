import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';

const COUNTRIES = [
  { label: 'United States', value: 'US', timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'] },
  { label: 'United Kingdom', value: 'GB', timezones: ['Europe/London'] },
  { label: 'France', value: 'FR', timezones: ['Europe/Paris'] },
  { label: 'Germany', value: 'DE', timezones: ['Europe/Berlin'] },
  { label: 'Canada', value: 'CA', timezones: ['America/Toronto', 'America/Vancouver'] },
  { label: 'Australia', value: 'AU', timezones: ['Australia/Sydney', 'Australia/Perth'] },
  { label: 'Nigeria', value: 'NG', timezones: ['Africa/Lagos'] },
  { label: 'South Africa', value: 'ZA', timezones: ['Africa/Johannesburg'] },
  { label: 'India', value: 'IN', timezones: ['Asia/Kolkata'] },
  { label: 'Japan', value: 'JP', timezones: ['Asia/Tokyo'] },
  { label: 'Brazil', value: 'BR', timezones: ['America/Sao_Paulo'] },
  { label: 'Mexico', value: 'MX', timezones: ['America/Mexico_City'] },
];

export function OrgSetupStep({ onNext, data }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [orgName, setOrgName] = useState(data.orgName ?? '');
  const [country, setCountry] = useState(data.country ?? '');
  const [timezone, setTimezone] = useState(data.timezone ?? '');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.value === country);
  const timezones = selectedCountry?.timezones ?? [];

  const canProceed = orgName.trim() && country && timezone;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ orgName: orgName.trim(), country, timezone });
  };

  const inputStyle = [
    styles.input,
    { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[typography.variants.titleLarge, { color: theme.onSurface }]}>
        {t('orgSetup.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('orgSetup.description')}
      </Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('orgSetup.orgName')}</Text>
        <TextInput
          style={inputStyle}
          value={orgName}
          onChangeText={setOrgName}
          placeholder={t('orgSetup.orgNamePlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
        />

        <Text style={[styles.label, { color: theme.onSurface }]}>{t('orgSetup.country')}</Text>
        <Pressable
          style={inputStyle}
          onPress={() => { setShowCountryPicker(!showCountryPicker); setShowTimezonePicker(false); }}
        >
          <Text style={{ color: country ? theme.onSurface : theme.onSurfaceVariant, lineHeight: 44 }}>
            {selectedCountry?.label ?? t('orgSetup.selectCountry')}
          </Text>
        </Pressable>
        {showCountryPicker && (
          <View style={[styles.picker, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            {COUNTRIES.map((c) => (
              <Pressable
                key={c.value}
                style={[styles.pickerItem, country === c.value && { backgroundColor: theme.primaryContainer }]}
                onPress={() => {
                  setCountry(c.value);
                  setTimezone(c.timezones[0]);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={{ color: theme.onSurface }}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.label, { color: theme.onSurface }]}>{t('orgSetup.timezone')}</Text>
        <Pressable
          style={inputStyle}
          onPress={() => { setShowTimezonePicker(!showTimezonePicker); setShowCountryPicker(false); }}
        >
          <Text style={{ color: timezone ? theme.onSurface : theme.onSurfaceVariant, lineHeight: 44 }}>
            {timezone || t('orgSetup.selectTimezone')}
          </Text>
        </Pressable>
        {showTimezonePicker && timezones.length > 0 && (
          <View style={[styles.picker, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            {timezones.map((tz) => (
              <Pressable
                key={tz}
                style={[styles.pickerItem, timezone === tz && { backgroundColor: theme.primaryContainer }]}
                onPress={() => { setTimezone(tz); setShowTimezonePicker(false); }}
              >
                <Text style={{ color: theme.onSurface }}>{tz}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={handleNext}
        disabled={!canProceed}
        style={[styles.btn, { backgroundColor: theme.primary, opacity: canProceed ? 1 : 0.4 }]}
      >
        <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
          {t('common.next')}
        </Text>
      </Pressable>
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
    justifyContent: 'center',
  },
  picker: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    maxHeight: 200,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  btn: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
