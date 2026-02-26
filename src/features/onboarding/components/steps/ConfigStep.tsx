import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';

type TemplateMode = 'standard' | 'custom';
type SecurityType = 'wpa3-personal' | 'wpa2-personal' | 'wpa2-enterprise' | 'open';

const SECURITY_OPTIONS: SecurityType[] = [
  'wpa2-personal',
  'wpa3-personal',
  'wpa2-enterprise',
  'open',
];

export function ConfigStep({ onNext, onBack, data }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [mode, setMode] = useState<TemplateMode>(data.configMode ?? 'standard');
  const [ssid, setSsid] = useState(data.ssid ?? '');
  const [password, setPassword] = useState(data.wifiPassword ?? '');
  const [securityType, setSecurityType] = useState<SecurityType>(data.securityType ?? 'wpa2-personal');
  const [vlanId, setVlanId] = useState(data.vlanId ?? '');
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

  const inputStyle = [
    styles.input,
    { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[typography.variants.titleLarge, { color: theme.onSurface }]}>
        {t('config.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('config.description')}
      </Text>

      {/* Mode toggle */}
      <View style={[styles.modeRow, { borderColor: theme.outline }]}>
        {(['standard', 'custom'] as TemplateMode[]).map((m) => (
          <Pressable
            key={m}
            style={[
              styles.modeBtn,
              mode === m && { backgroundColor: theme.primaryContainer },
            ]}
            onPress={() => setMode(m)}
          >
            <Text
              style={[
                typography.variants.labelMedium,
                { color: mode === m ? theme.onPrimaryContainer : theme.onSurfaceVariant },
              ]}
            >
              {t(`config.mode.${m}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {isStandard ? (
        <View style={[styles.standardInfo, { backgroundColor: theme.primaryContainer, borderColor: theme.primary }]}>
          <Text style={[typography.variants.bodyMedium, { color: theme.onPrimaryContainer }]}>
            {t('config.standardInfo')}
          </Text>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.ssid')}</Text>
          <TextInput style={inputStyle} value={ssid} onChangeText={setSsid} placeholder={t('config.ssidPlaceholder')} placeholderTextColor={theme.onSurfaceVariant} />

          <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.security')}</Text>
          <Pressable style={inputStyle} onPress={() => setShowSecurityPicker(!showSecurityPicker)}>
            <Text style={{ color: theme.onSurface, lineHeight: 44 }}>{t(`config.securityTypes.${securityType}`)}</Text>
          </Pressable>
          {showSecurityPicker && (
            <View style={[styles.picker, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
              {SECURITY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  style={[styles.pickerItem, securityType === opt && { backgroundColor: theme.primaryContainer }]}
                  onPress={() => { setSecurityType(opt); setShowSecurityPicker(false); }}
                >
                  <Text style={{ color: theme.onSurface }}>{t(`config.securityTypes.${opt}`)}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {needsPassword && (
            <>
              <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.password')}</Text>
              <TextInput style={inputStyle} value={password} onChangeText={setPassword} secureTextEntry placeholder={t('config.passwordPlaceholder')} placeholderTextColor={theme.onSurfaceVariant} />
            </>
          )}

          <Text style={[styles.label, { color: theme.onSurface }]}>{t('config.vlan')}</Text>
          <TextInput style={inputStyle} value={vlanId} onChangeText={setVlanId} keyboardType="numeric" placeholder="1-4094" placeholderTextColor={theme.onSurfaceVariant} />
        </View>
      )}

      <View style={styles.btnRow}>
        <Pressable onPress={onBack} style={[styles.btn, styles.backBtn, { borderColor: theme.outline }]}>
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>{t('common.back')}</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          style={[styles.btn, styles.nextBtn, { backgroundColor: theme.primary, opacity: canProceed ? 1 : 0.4 }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>{t('common.next')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  modeRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  standardInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
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
  backBtn: { flex: 1, borderWidth: 1 },
  nextBtn: { flex: 2 },
});
