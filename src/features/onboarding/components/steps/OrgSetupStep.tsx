import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';
import { PlatformIcon } from '../../../../components/PlatformIcon';
import { PickerModal, PickerField } from '../PickerModal';

const COUNTRIES = [
  { label: 'Australia',     value: 'AU', timezones: ['Australia/Sydney', 'Australia/Perth'] },
  { label: 'Brazil',        value: 'BR', timezones: ['America/Sao_Paulo'] },
  { label: 'Canada',        value: 'CA', timezones: ['America/Toronto', 'America/Vancouver'] },
  { label: 'France',        value: 'FR', timezones: ['Europe/Paris'] },
  { label: 'Germany',       value: 'DE', timezones: ['Europe/Berlin'] },
  { label: 'India',         value: 'IN', timezones: ['Asia/Kolkata'] },
  { label: 'Japan',         value: 'JP', timezones: ['Asia/Tokyo'] },
  { label: 'Mexico',        value: 'MX', timezones: ['America/Mexico_City'] },
  { label: 'Nigeria',       value: 'NG', timezones: ['Africa/Lagos'] },
  { label: 'South Africa',  value: 'ZA', timezones: ['Africa/Johannesburg'] },
  { label: 'United Kingdom',value: 'GB', timezones: ['Europe/London'] },
  { label: 'United States', value: 'US', timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'] },
];

type CountryValue = typeof COUNTRIES[number]['value'];

export function OrgSetupStep({ onNext, data }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [orgName, setOrgName] = useState<string>(data.orgName ?? '');
  const [country, setCountry] = useState<CountryValue | ''>(data.country ?? '');
  const [timezone, setTimezone] = useState<string>(data.timezone ?? '');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.value === country);
  const timezoneOptions = (selectedCountry?.timezones ?? []).map((tz) => ({
    label: tz.replace('_', ' '),
    value: tz,
  }));
  const countryOptions = COUNTRIES.map((c) => ({ label: c.label, value: c.value }));

  const canProceed = orgName.trim() && country && timezone;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ orgName: orgName.trim(), country, timezone });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Step icon */}
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryContainer }]}>
        <PlatformIcon
          feather="briefcase"
          symbol="building.2"
          size={28}
          color={theme.primary}
        />
      </View>

      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface, marginTop: spacing.md }]}>
        {t('orgSetup.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('orgSetup.description')}
      </Text>

      <View style={styles.form}>
        {/* Organization name */}
        <Text style={[styles.label, { color: theme.onSurface }]}>
          {t('orgSetup.orgName')}
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
          ]}
          value={orgName}
          onChangeText={setOrgName}
          placeholder={t('orgSetup.orgNamePlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
          returnKeyType="next"
        />

        {/* Country */}
        <Text style={[styles.label, { color: theme.onSurface }]}>
          {t('orgSetup.country')}
        </Text>
        <PickerField
          value={selectedCountry?.label ?? ''}
          placeholder={t('orgSetup.selectCountry')}
          onPress={() => setShowCountryPicker(true)}
        />

        {/* Timezone */}
        <Text style={[styles.label, { color: theme.onSurface }]}>
          {t('orgSetup.timezone')}
        </Text>
        <PickerField
          value={timezone.replace('_', ' ')}
          placeholder={t('orgSetup.selectTimezone')}
          onPress={() => country && setShowTimezonePicker(true)}
          disabled={!country}
        />
      </View>

      {/* Next */}
      <Pressable
        onPress={handleNext}
        disabled={!canProceed}
        android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
        style={({ pressed }) => [
          styles.primaryBtn,
          { backgroundColor: theme.primary, opacity: canProceed ? (Platform.OS === 'ios' && pressed ? 0.8 : 1) : 0.4 },
        ]}
      >
        <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
          {t('common.next')}
        </Text>
        <PlatformIcon feather="arrow-right" symbol="arrow.right" size={16} color={theme.onPrimary} />
      </Pressable>

      {/* Pickers */}
      <PickerModal
        visible={showCountryPicker}
        options={countryOptions}
        value={country}
        onSelect={(val) => {
          setCountry(val);
          const ct = COUNTRIES.find((c) => c.value === val);
          setTimezone(ct?.timezones[0] ?? '');
        }}
        onDismiss={() => setShowCountryPicker(false)}
        title={t('orgSetup.country')}
      />
      <PickerModal
        visible={showTimezonePicker}
        options={timezoneOptions}
        value={timezone}
        onSelect={setTimezone}
        onDismiss={() => setShowTimezonePicker(false)}
        title={t('orgSetup.timezone')}
      />
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
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
});
