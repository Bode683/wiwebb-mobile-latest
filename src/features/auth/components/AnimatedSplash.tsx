import React, { useEffect } from 'react';
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

type Props = { visible: boolean; onHidden: () => void };

export function AnimatedSplash({ visible, onHidden }: Props) {
  const { isDark } = useTheme();

  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.72);
  const logoOpacity = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);

  // Entrance animations
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withTiming(1, {
      duration: 850,
      easing: Easing.out(Easing.back(1.4)),
    });

    const pulseDuration = 2000;
    const pulseEasing = Easing.out(Easing.ease);
    ring1.value = withDelay(
      450,
      withRepeat(withTiming(1, { duration: pulseDuration, easing: pulseEasing }), -1, false),
    );
    ring2.value = withDelay(
      750,
      withRepeat(withTiming(1, { duration: pulseDuration, easing: pulseEasing }), -1, false),
    );
    ring3.value = withDelay(
      1050,
      withRepeat(withTiming(1, { duration: pulseDuration, easing: pulseEasing }), -1, false),
    );
  }, []);

  // Exit animation when auth is resolved
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
    >
      {/* Branded background */}
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
