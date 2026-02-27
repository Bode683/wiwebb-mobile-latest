import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';

const STEP_LABELS = ['Organization', 'Site', 'Devices', 'Network', 'Activation', 'Done'];

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring((current + 1) / total, {
      damping: 20,
      stiffness: 90,
    });
  }, [current, total, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const stepLabel = STEP_LABELS[current] ?? '';

  return (
    <View style={styles.wrapper}>
      {/* Step counter + label */}
      <View style={styles.meta}>
        <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant }]}>
          Step {current + 1} of {total}
        </Text>
        <Text style={[typography.variants.labelMedium, { color: theme.primary }]}>
          {stepLabel}
        </Text>
      </View>

      {/* Animated fill bar */}
      <View style={[styles.track, { backgroundColor: theme.outline }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: theme.primary }, animatedStyle]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  track: {
    height: 4,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
