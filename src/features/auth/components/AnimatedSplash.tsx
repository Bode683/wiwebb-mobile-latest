import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import AuthBgDark from '../../../assets/common/auth-background-dark.svg';
import AuthBgLight from '../../../assets/common/auth-background-light.svg';
import WiweebLogo from '../../../assets/brand-logo/wiweeb-orange.svg';

const { width, height } = Dimensions.get('screen');
const RING_SIZE = 140;
const PULSE_COLOR = '#f59e0b';

type Props = {
  visible: boolean;
  onReady: () => void;
  onHidden: () => void;
};

export function AnimatedSplash({ visible, onReady, onHidden }: Props) {
  const { isDark } = useTheme();

  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.72);
  const logoOpacity = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);

  // Entrance animations — start immediately on mount
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withTiming(1, {
      duration: 850,
      easing: Easing.out(Easing.back(1.4)),
    });

    const pulseDuration = 2000;
    const pulseEasing = Easing.out(Easing.ease);
    ring1.value = withDelay(
      400,
      withRepeat(withTiming(1, { duration: pulseDuration, easing: pulseEasing }), -1, false),
    );
    ring2.value = withDelay(
      700,
      withRepeat(withTiming(1, { duration: pulseDuration, easing: pulseEasing }), -1, false),
    );
    ring3.value = withDelay(
      1000,
      withRepeat(withTiming(1, { duration: pulseDuration, easing: pulseEasing }), -1, false),
    );
  }, []);

  // Exit animation — triggered when both auth ready + min time passed
  useEffect(() => {
    if (!visible) {
      containerOpacity.value = withTiming(
        0,
        { duration: 420, easing: Easing.in(Easing.ease) },
        (done) => {
          if (done) runOnJS(onHidden)();
        },
      );
    }
  }, [visible]);

  // Called once the background view is laid out and painted.
  // We defer one animation frame to guarantee the native layer has flushed
  // before we signal the parent to hide the system splash screen.
  const handleLayout = useCallback(() => {
    requestAnimationFrame(() => onReady());
  }, [onReady]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: interpolate(ring1.value, [0, 0.25, 1], [0, 0.45, 0]),
    transform: [{ scale: interpolate(ring1.value, [0, 1], [0.55, 2.4]) }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: interpolate(ring2.value, [0, 0.25, 1], [0, 0.35, 0]),
    transform: [{ scale: interpolate(ring2.value, [0, 1], [0.55, 2.4]) }],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    opacity: interpolate(ring3.value, [0, 0.25, 1], [0, 0.25, 0]),
    transform: [{ scale: interpolate(ring3.value, [0, 1], [0.55, 2.4]) }],
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, containerStyle]}
      pointerEvents="none"
      onLayout={handleLayout}
    >
      {/* Branded background — painted before system splash hides */}
      {isDark ? (
        <AuthBgDark
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <AuthBgLight
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="xMidYMid slice"
        />
      )}

      <View style={styles.center}>
        {/* Signal broadcast pulse rings */}
        <Animated.View style={[styles.ring, ring1Style]} />
        <Animated.View style={[styles.ring, ring2Style]} />
        <Animated.View style={[styles.ring, ring3Style]} />

        {/* Logo */}
        <Animated.View style={logoStyle}>
          <WiweebLogo width={210} height={72} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: PULSE_COLOR,
  },
});
