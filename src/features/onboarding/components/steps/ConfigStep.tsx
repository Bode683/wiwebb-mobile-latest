import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';
import { PickerModal, PickerField } from '../PickerModal';

type TemplateMode = 'standard' | 'custom';
type SecurityType = 'wpa2-personal' | 'wpa3-personal' | 'wpa2-enterprise' | 'open';

const SECURITY_OPTIONS: Array<{ label: string; value: SecurityType }> = [
  { label: 'WPA2 Personal',   value: 'wpa2-personal' },
  { label: 'WPA3 Personal',   value: 'wpa3-personal' },
  { label: 'WPA2 Enterprise', value: 'wpa2-enterprise' },
  { label: 'Open (no password)', value: 'open' },
];

interface ModeOption {
  mode: TemplateMode;
  name: string;
  symbol: string;
  labelKey: string;
}

const MODE_OPTIONS: ModeOption[] = [
  { mode: 'standard', name: 'zap',     symbol: 'bolt',               labelKey: 'config.mode.standard' },
  { mode: 'custom',   name: 'sliders', symbol: 'slider.horizontal.3', labelKey: 'config.mode.custom' },
];

export function ConfigStep({ onNext, onBack, data }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [mode, setMode]                   = useState<TemplateMode>(data.configMode ?? 'standard');
  const [ssid, setSsid]                   = useState<string>(data.ssid ?? '');
  const [password, setPassword]           = useState<string>(data.wifiPassword ?? '');
  const [securityType, setSecurityType]   = useState<SecurityType>(data.securityType ?? 'wpa2-personal');
  const [vlanId, setVlanId]               = useState<string>(data.vlanId ?? '');
  const [showSecurityPicker, setShowSecurityPicker] = useState(false);

  const isStandard = mode === 'standard';
  const needsPassword = securityType !== 'open';
  const canProceed = isStandard || (ssid.trim() && (!needsPassword || password.trim()));

  const handleNext = () => {
    if (!canProceed) return;
    if (isStandard) {
      onNext({ configMode: 'standard' });
    } else {
      const vlanNum = vlanId ? parseInt(vlanId, 10) : null;
      onNext({
        configMode: 'custom',
        ssid: ssid.trim(),
        wifiPassword: password,
        securityType,
        vlanId: vlanNum && vlanNum >= 1 && vlanNum <= 4094 ? vlanNum : null,
      });
    }
  };

  const selectedSecurityLabel =
    SECURITY_OPTIONS.find((o) => o.value === securityType)?.label ?? securityType;

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
        <AppIcon type="Feather" name="wifi" symbol="wifi" size={28} color={theme.primary} />
      </View>

      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface, marginTop: spacing.md }]}>
        {t('config.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('config.description')}
      </Text>

      {/* Mode toggle — segmented control */}
      <View style={[styles.modeRow, { borderColor: theme.outline, backgroundColor: theme.surfaceVariant }]}>
        {MODE_OPTIONS.map(({ mode: m, name, symbol, labelKey }) => {
          const active = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              android_ripple={{ color: 'rgba(245,158,11,0.12)' }}
              style={({ pressed }) => [
                styles.modeBtn,
                active && { backgroundColor: theme.surface },
                Platform.OS === 'ios' && pressed && !active && { opacity: 0.7 },
              ]}
            >
              <AppIcon
                type="Feather"
                name={name}
                symbol={symbol}
                size={16}
                color={active ? theme.primary : theme.onSurfaceVariant}
              />
              <Text
                style={[
                  typography.variants.labelMedium,
                  { color: active ? theme.onSurface : theme.onSurfaceVariant },
                ]}
              >
                {t(labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Mode content */}
      {isStandard ? (
        <View style={[styles.infoBox, { backgroundColor: theme.primaryContainer, borderColor: theme.primary }]}>
          <AppIcon type="Feather" name="info" size={16} color={theme.primary} />
          <Text style={[typography.variants.bodyMedium, { color: theme.onPrimaryContainer, flex: 1 }]}>
            {t('config.standardInfo')}
          </Text>
        </View>
      ) : (
        <View style={styles.form}>
          {/* SSID */}
          <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.ssid')}</Text>
          <TextInput
            style={inputStyle}
            value={ssid}
            onChangeText={setSsid}
            placeholder={t('config.ssidPlaceholder')}
            placeholderTextColor={theme.onSurfaceVariant}
          />

          {/* Security type */}
          <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.security')}</Text>
          <PickerField
            value={selectedSecurityLabel}
            placeholder={t('config.security')}
            onPress={() => setShowSecurityPicker(true)}
          />

          {/* Password (conditional) */}
          {needsPassword && (
            <>
              <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.password')}</Text>
              <TextInput
                style={inputStyle}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder={t('config.passwordPlaceholder')}
                placeholderTextColor={theme.onSurfaceVariant}
              />
            </>
          )}

          {/* Open network warning */}
          {securityType === 'open' && (
            <View style={[styles.warnBox, { backgroundColor: theme.errorContainer, borderColor: theme.error }]}>
              <AppIcon type="Feather" name="alert-triangle" size={15} color={theme.error} />
              <Text style={[typography.variants.bodySmall, { color: theme.onErrorContainer, flex: 1 }]}>
                Open networks are visible to anyone nearby. Only use this in trusted environments.
              </Text>
            </View>
          )}

          {/* VLAN ID */}
          <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.vlan')}</Text>
          <TextInput
            style={inputStyle}
            value={vlanId}
            onChangeText={setVlanId}
            keyboardType="number-pad"
            placeholder="1 – 4094  (optional)"
            placeholderTextColor={theme.onSurfaceVariant}
          />
        </View>
      )}

      {/* Navigation */}
      <View style={styles.btnRow}>
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

      <PickerModal
        visible={showSecurityPicker}
        options={SECURITY_OPTIONS}
        value={securityType}
        onSelect={setSecurityType}
        onDismiss={() => setShowSecurityPicker(false)}
        title={t('config.security')}
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
  modeRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.lg,
    padding: 3,
    gap: 3,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  warnBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
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
  backBtn: { flex: 1, borderWidth: 1 },
  nextBtn: { flex: 2 },
});
