import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import { mmkvStorage } from '../../../../mmkv';
import { useTheme } from '../../../../theme';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

type LangOption = 'system' | 'en' | 'fr';

const LOCALE_KEY = 'app_locale';

function getInitialLang(): LangOption {
  const stored = mmkvStorage.getString(LOCALE_KEY);
  if (stored === 'en' || stored === 'fr') return stored;
  return 'system';
}

export default function LanguageScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');
  const [selected, setSelected] = useState<LangOption>(getInitialLang);

  const options: { value: LangOption; label: string }[] = [
    { value: 'system', label: t('language.options.followSystem') },
    { value: 'en', label: t('language.options.english') },
    { value: 'fr', label: t('language.options.french') },
  ];

  const handleSelect = (lang: LangOption) => {
    setSelected(lang);
    if (lang === 'system') {
      mmkvStorage.remove(LOCALE_KEY);
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage(lang);
    }
  };

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.card}>
        {options.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[s.row, i > 0 && s.rowBorder, isSelected && s.rowSelected]}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[s.label, isSelected && s.labelSelected]}>
                {opt.label}
              </Text>
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
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    rowSelected: {
      backgroundColor: theme.primaryContainer,
    },
    label: {
      flex: 1,
      fontSize: typography.sizes.md,
      color: theme.onSurface,
    },
    labelSelected: {
      color: theme.onSurface,
      fontWeight: typography.weights.medium,
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
