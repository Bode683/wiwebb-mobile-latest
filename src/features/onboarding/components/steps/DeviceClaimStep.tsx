import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';

interface Device {
  id: string;
  serialNumber: string;
  macAddress: string;
}

function formatMac(raw: string): string {
  const hex = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 12);
  return hex.match(/.{1,2}/g)?.join(':').toUpperCase() ?? hex.toUpperCase();
}

export function DeviceClaimStep({ onNext, onBack, data }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [devices, setDevices] = useState<Device[]>(data.devices ?? []);
  const [serial, setSerial] = useState('');
  const [mac, setMac] = useState('');

  const canAdd = serial.trim() && mac.replace(/[^0-9a-fA-F]/g, '').length === 12;
  const canProceed = devices.length > 0;

  const addDevice = () => {
    if (!canAdd) return;
    setDevices((prev) => [
      ...prev,
      { id: `${Date.now()}`, serialNumber: serial.trim(), macAddress: formatMac(mac) },
    ]);
    setSerial('');
    setMac('');
  };

  const removeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ devices });
  };

  const inputStyle = [
    styles.input,
    { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[typography.variants.titleLarge, { color: theme.onSurface }]}>
        {t('deviceClaim.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('deviceClaim.description')}
      </Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('deviceClaim.serialNumber')}</Text>
        <TextInput
          style={inputStyle}
          value={serial}
          onChangeText={setSerial}
          placeholder={t('deviceClaim.serialPlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
          autoCapitalize="characters"
        />

        <Text style={[styles.label, { color: theme.onSurface }]}>{t('deviceClaim.macAddress')}</Text>
        <TextInput
          style={inputStyle}
          value={mac}
          onChangeText={setMac}
          placeholder="AA:BB:CC:DD:EE:FF"
          placeholderTextColor={theme.onSurfaceVariant}
          autoCapitalize="characters"
        />

        <Pressable
          onPress={addDevice}
          disabled={!canAdd}
          style={[styles.addBtn, { borderColor: theme.primary, opacity: canAdd ? 1 : 0.4 }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.primary }]}>
            {t('deviceClaim.addDevice')}
          </Text>
        </Pressable>
      </View>

      {devices.length > 0 && (
        <View style={[styles.deviceList, { borderColor: theme.outline }]}>
          <Text style={[typography.variants.labelMedium, { color: theme.onSurfaceVariant, marginBottom: spacing.sm }]}>
            {t('deviceClaim.claimedDevices', { count: devices.length })}
          </Text>
          {devices.map((d) => (
            <View key={d.id} style={[styles.deviceRow, { borderColor: theme.outline }]}>
              <View style={{ flex: 1 }}>
                <Text style={[typography.variants.bodyMedium, { color: theme.onSurface }]}>
                  {d.serialNumber}
                </Text>
                <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
                  {d.macAddress}
                </Text>
              </View>
              <Pressable onPress={() => removeDevice(d.id)} hitSlop={8}>
                <Text style={{ color: theme.error, fontSize: 18 }}>{'\u2715'}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={styles.btnRow}>
        <Pressable onPress={onBack} style={[styles.btn, styles.backBtn, { borderColor: theme.outline }]}>
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
            {t('common.back')}
          </Text>
        </Pressable>
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
  addBtn: {
    height: 44,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  deviceList: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
