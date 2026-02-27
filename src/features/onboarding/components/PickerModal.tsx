import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, typography, spacing, borderRadius, shadows } from '../../../theme';

export interface PickerOption<T extends string = string> {
  label: string;
  value: T;
}

interface PickerModalProps<T extends string> {
  visible: boolean;
  options: PickerOption<T>[];
  value: T | '';
  onSelect: (value: T) => void;
  onDismiss: () => void;
  title?: string;
}

export function PickerModal<T extends string>({
  visible,
  options,
  value,
  onSelect,
  onDismiss,
  title,
}: PickerModalProps<T>) {
  const { theme } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isIOS ? 'slide' : 'fade'}
      onRequestClose={onDismiss}
    >
      <Pressable
        style={[styles.overlay, !isIOS && styles.overlayCenter]}
        onPress={onDismiss}
      >
        {/* Inner Pressable stops tap-through */}
        <Pressable
          style={[
            styles.sheet,
            isIOS ? styles.sheetBottom : styles.sheetCenter,
            { backgroundColor: theme.surface, borderColor: theme.outline },
          ]}
          onPress={() => {}}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.outline }]}>
            {title ? (
              <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
                {title}
              </Text>
            ) : (
              <View />
            )}
            <Pressable onPress={onDismiss} hitSlop={8}>
              <Text style={[typography.variants.labelLarge, { color: theme.primary }]}>
                Done
              </Text>
            </Pressable>
          </View>

          {/* Options list */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            style={styles.list}
            renderItem={({ item }) => {
              const selected = value === item.value;
              return (
                <Pressable
                  onPress={() => { onSelect(item.value); onDismiss(); }}
                  android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
                  style={({ pressed }) => [
                    styles.option,
                    { borderBottomColor: theme.outline },
                    selected && { backgroundColor: theme.primaryContainer },
                    Platform.OS === 'ios' && pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text
                    style={[
                      typography.variants.bodyMedium,
                      { color: selected ? theme.onPrimaryContainer : theme.onSurface },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selected && (
                    <Feather name="check" size={16} color={theme.primary} />
                  )}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Picker field trigger ────────────────────────────────────────────────────

interface PickerFieldProps {
  value: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PickerField({ value, placeholder, onPress, disabled }: PickerFieldProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(245,158,11,0.08)' }}
      style={({ pressed }) => [
        styles.field,
        {
          borderColor: theme.outline,
          backgroundColor: theme.surfaceVariant,
          opacity: disabled ? 0.5 : Platform.OS === 'ios' && pressed ? 0.75 : 1,
        },
      ]}
    >
      <Text
        style={[
          typography.variants.bodyMedium,
          { color: value ? theme.onSurface : theme.onSurfaceVariant, flex: 1 },
        ]}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>
      <Feather name="chevron-down" size={16} color={theme.onSurfaceVariant} />
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    borderWidth: StyleSheet.hairlineWidth,
    ...shadows.xl,
    overflow: 'hidden',
  },
  sheetBottom: {},
  sheetCenter: {
    borderRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: {
    maxHeight: 340,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});
