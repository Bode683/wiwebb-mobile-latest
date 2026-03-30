import React from 'react';
import { Platform } from 'react-native';
import { Feather, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';
import * as CustomIcons from './customIcons';

export type IconLibrary = 'Feather' | 'AntDesign' | 'MaterialIcons' | 'Ionicons' | 'Custom';

interface AppIconProps {
  type: IconLibrary;
  name: string;
  /** SF Symbol name for iOS — falls back to `name` when omitted */
  symbol?: string;
  size?: number;
  color?: string;
}

const VECTOR_ICONS = { Feather, AntDesign, MaterialIcons, Ionicons } as const;

/**
 * Unified, platform-aware icon component.
 * - iOS: renders native SF Symbols via expo-symbols (`symbol` if provided, falls back to `name`)
 * - Android/web: renders from @expo/vector-icons using `type` to select the library
 * - Custom: renders an SVG component from the local customIcons registry
 */
export function AppIcon({ type, name, symbol, size = 24, color = '#000' }: AppIconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={(symbol ?? name) as any}
        size={size}
        tintColor={color}
        type="monochrome"
      />
    );
  }

  if (type === 'Custom') {
    const CustomIcon = CustomIcons[name as keyof typeof CustomIcons];
    if (!CustomIcon) return null;
    return <CustomIcon width={size} height={size} color={color} />;
  }

  const IconComponent = VECTOR_ICONS[type];
  if (!IconComponent) return null;
  return <IconComponent name={name as any} size={size} color={color} />;
}
