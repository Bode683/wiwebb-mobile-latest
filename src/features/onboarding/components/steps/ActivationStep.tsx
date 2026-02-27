import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import type { OnboardingStepProps } from '../OnboardingWizard';
import { useTheme, typography, spacing, borderRadius } from '../../../../theme';
import { PlatformIcon } from '../../../../components/PlatformIcon';

type ConnectionStatus = 'idle' | 'polling' | 'timeout';

const MAX_POLLS = 5;
const POLL_INTERVAL_MS = 3000;

// ─── Signal ripple illustration ───────────────────────────────────────────────

function SignalRipple({ active }: { active: boolean }) {
  const { theme } = useTheme();

  const scale1 = useSharedValue(0.4);
  const scale2 = useSharedValue(0.4);
  const scale3 = useSharedValue(0.4);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      scale1.value = 0.4; scale2.value = 0.4; scale3.value = 0.4;
      opacity1.value = 0; opacity2.value = 0; opacity3.value = 0;
      return;
    }

    const ring = (
      scale: typeof scale1,
      op: typeof opacity1,
      delay: number,
    ) => {
      const cfg = { duration: 1600, easing: Easing.out(Easing.ease) };
      scale.value  = withDelay(delay, withRepeat(withTiming(1.4, cfg), -1, false));
      op.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.5, { duration: 200 }),
            withTiming(0, { duration: 1400 }),
          ),
          -1,
          false,
        ),
      );
    };

    ring(scale1, opacity1, 0);
    ring(scale2, opacity2, 500);
    ring(scale3, opacity3, 1000);
  }, [active, scale1, scale2, scale3, opacity1, opacity2, opacity3]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
    opacity: opacity3.value,
  }));

  const ringBase = {
    position: 'absolute' as const,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: theme.primary,
  };

  return (
    <View style={styles.rippleWrap}>
      <Animated.View style={[ringBase, ring3Style]} />
      <Animated.View style={[ringBase, ring2Style]} />
      <Animated.View style={[ringBase, ring1Style]} />
      {/* Center icon */}
      <View style={[styles.rippleCenter, { backgroundColor: theme.primaryContainer }]}>
        <PlatformIcon
          feather="radio"
          symbol="antenna.radiowaves.left.and.right"
          size={28}
          color={theme.primary}
        />
      </View>
    </View>
  );
}

// ─── Instruction step row ─────────────────────────────────────────────────────

function InstructionRow({ step, label }: { step: number; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.instructionRow}>
      <View style={[styles.stepBadge, { backgroundColor: theme.primaryContainer }]}>
        <Text style={[typography.variants.labelMedium, { color: theme.primary }]}>{step}</Text>
      </View>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurface, flex: 1 }]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActivationStep({ onNext, onBack }: OnboardingStepProps) {
  const { t } = useTranslation('onboarding');
  const { theme } = useTheme();

  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [pollCount, setPollCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    setPollCount(0);
    setStatus('polling');

    let count = 0;
    timerRef.current = setInterval(() => {
      count += 1;
      setPollCount(count);
      // In production: query API for device status here.
      if (count >= MAX_POLLS) {
        stopPolling();
        setStatus('timeout');
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const isPolling = status === 'polling';
  const isTimeout = status === 'timeout';
  const isIdle    = status === 'idle';

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface }]}>
        {t('activation.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('activation.description')}
      </Text>

      {/* Signal illustration — always visible, animated only when polling */}
      <View style={styles.illustrationArea}>
        <SignalRipple active={isPolling} />
      </View>

      {/* Idle: instructions */}
      {isIdle && (
        <View style={styles.instructions}>
          {[1, 2, 3].map((step) => (
            <InstructionRow key={step} step={step} label={t(`activation.step${step}`)} />
          ))}
        </View>
      )}

      {/* Polling: status text */}
      {isPolling && (
        <View style={styles.pollingInfo}>
          <Text style={[typography.variants.bodyMedium, { color: theme.onSurface, textAlign: 'center' }]}>
            {t('activation.polling')}
          </Text>
          <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: spacing.xs }]}>
            Attempt {pollCount} of {MAX_POLLS}
          </Text>
        </View>
      )}

      {/* Timeout: notice */}
      {isTimeout && (
        <View style={[styles.noticeBox, { backgroundColor: theme.primaryContainer, borderColor: theme.primary }]}>
          <Feather name="info" size={16} color={theme.primary} style={{ marginTop: 2 }} />
          <Text style={[typography.variants.bodyMedium, { color: theme.onPrimaryContainer, flex: 1 }]}>
            {t('activation.timeout')}
          </Text>
        </View>
      )}

      <View style={styles.spacer} />

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

        {isIdle ? (
          <Pressable
            onPress={startPolling}
            android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
            style={({ pressed }) => [
              styles.btn,
              styles.nextBtn,
              { backgroundColor: theme.primary, opacity: Platform.OS === 'ios' && pressed ? 0.8 : 1 },
            ]}
          >
            <PlatformIcon feather="activity" symbol="waveform.path.ecg" size={16} color={theme.onPrimary} />
            <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
              {t('activation.startMonitoring')}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => onNext()}
            android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
            style={({ pressed }) => [
              styles.btn,
              styles.nextBtn,
              { backgroundColor: theme.primary, opacity: Platform.OS === 'ios' && pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
              {isPolling ? t('activation.skip') : t('common.next')}
            </Text>
            <PlatformIcon feather="arrow-right" symbol="arrow.right" size={16} color={theme.onPrimary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    marginTop: spacing.lg,
  },
  rippleWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    gap: spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollingInfo: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  spacer: { flex: 1 },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
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
