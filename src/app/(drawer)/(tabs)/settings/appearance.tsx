import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';
import { mmkvStorage } from '../../../../mmkv';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

type ThemePreference = 'light' | 'dark' | 'system';

const PREF_KEY = 'app-theme-preference';

function getInitialPref(): ThemePreference {
  const stored = mmkvStorage.getString(PREF_KEY) as ThemePreference | undefined;
  return stored ?? 'light';
}

export default function AppearanceScreen() {
  const { theme, setColorScheme } = useTheme();
  const { t } = useTranslation('settings');
  const systemScheme = useColorScheme() ?? 'light';
  const [selected, setSelected] = useState<ThemePreference>(getInitialPref);

  const options: { value: ThemePreference; label: string; subtitle: string; icon: string; symbol: string }[] = [
    { value: 'light', label: t('appearance.options.light'), subtitle: t('appearance.options.lightSubtitle'), icon: 'sun', symbol: 'sun.min' },
    { value: 'dark', label: t('appearance.options.dark'), subtitle: t('appearance.options.darkSubtitle'), icon: 'moon', symbol: 'moon' },
    { value: 'system', label: t('appearance.options.system'), subtitle: t('appearance.options.systemSubtitle'), icon: 'monitor', symbol: 'laptopcomputer' },
  ];

  const handleSelect = (pref: ThemePreference) => {
    setSelected(pref);
    mmkvStorage.set(PREF_KEY, pref);
    setColorScheme(pref === 'system' ? systemScheme : pref);
  };

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.sectionHeader}>
        {t('appearance.sections.theme').toUpperCase()}
      </Text>
      <View style={s.card}>
        {options.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[s.row, i > 0 && s.rowBorder]}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.7}
            >
              <View style={s.rowIcon}>
                <AppIcon
                  type="Feather"
                  name={opt.icon}
                  symbol={opt.symbol}
                  size={20}
                  color={theme.onSurfaceVariant}
                />
              </View>
              <View style={s.rowText}>
                <Text style={s.rowLabel}>{opt.label}</Text>
                <Text style={s.rowSubtitle}>{opt.subtitle}</Text>
              </View>
              <View style={[s.radio, isSelected && s.radioSelected]}>
                {isSelected && <View style={s.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    sectionHeader: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.semibold,
      color: theme.onSurfaceVariant,
      letterSpacing: 0.8,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    rowIcon: {
      width: 28,
      alignItems: 'center',
    },
    rowText: {
      flex: 1,
    },
    rowLabel: {
      fontSize: typography.sizes.md,
      color: theme.onSurface,
    },
    rowSubtitle: {
      fontSize: typography.sizes.sm,
      color: theme.onSurfaceVariant,
      marginTop: spacing.half,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: theme.outline,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: '#f59e0b',
      backgroundColor: '#f59e0b',
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
  });
