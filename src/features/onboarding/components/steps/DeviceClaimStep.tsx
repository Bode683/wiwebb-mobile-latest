import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';
import { PlatformIcon } from '../../../../components/PlatformIcon';

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

  const macHexCount = mac.replace(/[^0-9a-fA-F]/g, '').length;
  const canAdd = serial.trim().length > 0 && macHexCount === 12;
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

  /**
   * QR scan is a native mobile feature not available on web.
   * Requires expo-camera + expo-barcode-scanner to be installed.
   * TODO: Implement when expo-camera is added to dependencies.
   */
  const handleQrScan = () => {
    Alert.alert(
      'QR Scan',
      'Camera scanning requires expo-camera. Add it with:\nnpx expo install expo-camera',
      [{ text: 'OK' }],
    );
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
        <PlatformIcon feather="cpu" symbol="cpu" size={28} color={theme.primary} />
      </View>

      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface, marginTop: spacing.md }]}>
        {t('deviceClaim.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('deviceClaim.description')}
      </Text>

      <View style={styles.form}>
        {/* Serial number */}
        <Text style={[styles.label, { color: theme.onSurface }]}>{t('deviceClaim.serialNumber')}</Text>
        <TextInput
          style={inputStyle}
          value={serial}
          onChangeText={setSerial}
          placeholder={t('deviceClaim.serialPlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
          autoCapitalize="characters"
          returnKeyType="next"
        />

        {/* MAC address — monospace for readability */}
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.onSurface, marginTop: 0 }]}>
            {t('deviceClaim.macAddress')}
          </Text>
          {mac.length > 0 && (
            <Text
              style={[
                typography.variants.labelSmall,
                {
                  color: macHexCount === 12 ? '#16a34a' : macHexCount > 0 ? theme.error : theme.onSurfaceVariant,
                  fontFamily: typography.fonts.mono,
                },
                Platform.OS === 'android' && { includeFontPadding: false },
              ]}
            >
              {macHexCount}/12 hex digits
            </Text>
          )}
        </View>
        <TextInput
          style={[
            inputStyle,
            { fontFamily: typography.fonts.mono },
            Platform.OS === 'android' && { includeFontPadding: false },
            mac.length > 0 && macHexCount !== 12 && { borderColor: theme.error },
            macHexCount === 12 && { borderColor: '#16a34a' },
          ]}
          value={mac}
          onChangeText={setMac}
          placeholder="AA:BB:CC:DD:EE:FF"
          placeholderTextColor={theme.onSurfaceVariant}
          autoCapitalize="characters"
          returnKeyType="done"
        />
        {mac.length > 0 && macHexCount !== 12 && (
          <Text style={[typography.variants.labelSmall, { color: theme.error }]}>
            Needs exactly 12 hex digits — e.g. AA:BB:CC:DD:EE:FF or AABBCCDDEEFF
          </Text>
        )}

        {/* Entry actions */}
        <View style={styles.actionRow}>
          {/* Add device button */}
          <Pressable
            onPress={addDevice}
            disabled={!canAdd}
            android_ripple={{ color: 'rgba(245,158,11,0.12)' }}
            style={({ pressed }) => [
              styles.addBtn,
              { borderColor: theme.primary, flex: 1 },
              { opacity: canAdd ? (Platform.OS === 'ios' && pressed ? 0.7 : 1) : 0.4 },
            ]}
          >
            <PlatformIcon feather="plus" symbol="plus" size={16} color={theme.primary} />
            <Text style={[typography.variants.labelLarge, { color: theme.primary }]}>
              {t('deviceClaim.addDevice')}
            </Text>
          </Pressable>

          {/* QR scan — mobile-native feature */}
          <Pressable
            onPress={handleQrScan}
            android_ripple={{ color: 'rgba(245,158,11,0.12)' }}
            style={({ pressed }) => [
              styles.qrBtn,
              { borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
              Platform.OS === 'ios' && pressed && { opacity: 0.7 },
            ]}
          >
            <PlatformIcon feather="camera" symbol="qrcode.viewfinder" size={20} color={theme.onSurface} />
          </Pressable>
        </View>
      </View>

      {/* Claimed devices list */}
      {devices.length > 0 && (
        <View style={[styles.deviceList, { borderTopColor: theme.outline }]}>
          <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant, marginBottom: spacing.sm }]}>
            {t('deviceClaim.claimedDevices', { count: devices.length })}
          </Text>
          {devices.map((d) => (
            <View
              key={d.id}
              style={[styles.deviceRow, { borderColor: theme.outline, backgroundColor: theme.surface }]}
            >
              <View style={[styles.deviceIconWrap, { backgroundColor: theme.primaryContainer }]}>
                <Feather name="cpu" size={14} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.variants.labelMedium, { color: theme.onSurface }]}>
                  {d.serialNumber}
                </Text>
                <Text
                  style={[
                    typography.variants.labelSmall,
                    {
                      color: theme.onSurfaceVariant,
                      fontFamily: typography.fonts.mono,
                    },
                    Platform.OS === 'android' && { includeFontPadding: false },
                  ]}
                >
                  {d.macAddress}
                </Text>
              </View>
              <Pressable
                onPress={() => removeDevice(d.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                android_ripple={{ color: 'rgba(239,68,68,0.10)', borderless: true }}
                style={({ pressed }) => [
                  styles.removeBtn,
                  Platform.OS === 'ios' && pressed && { opacity: 0.6 },
                ]}
              >
                <Feather name="x" size={16} color={theme.error} />
              </Pressable>
            </View>
          ))}
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
          <PlatformIcon feather="arrow-left" symbol="arrow.left" size={16} color={theme.onSurface} />
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
          <PlatformIcon feather="arrow-right" symbol="arrow.right" size={16} color={theme.onPrimary} />
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
  },
  qrBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceList: {
    marginTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  deviceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    padding: spacing.xs,
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
