import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';

type ConnectionStatus = 'idle' | 'polling' | 'timeout';

const MAX_POLLS = 5;
const POLL_INTERVAL_MS = 3000;

export function ActivationStep({ onNext, onBack }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const pollCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    pollCount.current = 0;
    setStatus('polling');

    timerRef.current = setInterval(() => {
      pollCount.current += 1;
      // In a real implementation, this would query the API for device status.
      // For now we always time out after MAX_POLLS.
      if (pollCount.current >= MAX_POLLS) {
        stopPolling();
        setStatus('timeout');
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return (
    <View style={styles.container}>
      <Text style={[typography.variants.titleLarge, { color: theme.onSurface }]}>
        {t('activation.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('activation.description')}
      </Text>

      {status === 'idle' && (
        <View style={styles.instructions}>
          {[1, 2, 3].map((step) => (
            <View key={step} style={styles.instructionRow}>
              <View style={[styles.badge, { backgroundColor: theme.primaryContainer }]}>
                <Text style={[typography.variants.labelMedium, { color: theme.onPrimaryContainer }]}>
                  {step}
                </Text>
              </View>
              <Text style={[typography.variants.bodyMedium, { color: theme.onSurface, flex: 1 }]}>
                {t(`activation.step${step}`)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {status === 'polling' && (
        <View style={styles.pollingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.md }]}>
            {t('activation.polling')}
          </Text>
        </View>
      )}

      {status === 'timeout' && (
        <View style={[styles.timeoutBox, { backgroundColor: theme.primaryContainer, borderColor: theme.primary }]}>
          <Text style={[typography.variants.bodyMedium, { color: theme.onPrimaryContainer }]}>
            {t('activation.timeout')}
          </Text>
        </View>
      )}

      <View style={styles.spacer} />

      <View style={styles.btnRow}>
        <Pressable onPress={onBack} style={[styles.btn, styles.backBtn, { borderColor: theme.outline }]}>
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
            {t('common.back')}
          </Text>
        </Pressable>

        {status === 'idle' ? (
          <Pressable
            onPress={startPolling}
            style={[styles.btn, styles.nextBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
              {t('activation.startMonitoring')}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => onNext()}
            style={[styles.btn, styles.nextBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
              {status === 'polling' ? t('activation.skip') : t('common.next')}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  instructions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollingContainer: {
    marginTop: spacing['2xl'],
    alignItems: 'center',
  },
  timeoutBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  spacer: { flex: 1 },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
