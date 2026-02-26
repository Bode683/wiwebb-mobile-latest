import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, spacing, borderRadius } from '../../../theme';

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

  return (
    <View style={[styles.track, { backgroundColor: theme.outline }]}>
      <Animated.View
        style={[styles.fill, { backgroundColor: theme.primary }, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
