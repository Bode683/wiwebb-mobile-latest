import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

interface PlatformIconProps {
  /** Feather icon name — Android and web fallback */
  feather: FeatherName;
  /** SF Symbol name — iOS only */
  symbol: string;
  size?: number;
  color?: string;
}

/**
 * Platform-aware icon component.
 * - iOS: renders native SF Symbols via expo-symbols
 * - Android: renders Feather icons from @expo/vector-icons
 */
export function PlatformIcon({ feather, symbol, size = 24, color = '#000' }: PlatformIconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={symbol as any}
        size={size}
        tintColor={color}
        type="monochrome"
      />
    );
  }
  return <Feather name={feather} size={size} color={color} />;
}
