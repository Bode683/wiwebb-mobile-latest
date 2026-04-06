import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

type LinkKey = 'termsOfUse' | 'privacyPolicy' | 'documentation' | 'contactSupport';

const LINK_KEYS: LinkKey[] = ['termsOfUse', 'privacyPolicy', 'documentation', 'contactSupport'];

export default function AboutScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');
  const router = useRouter();

  const handleLink = (key: LinkKey) => {
    if (key === 'documentation') router.push('/(drawer)/help/documentation');
    else if (key === 'contactSupport') router.push('/(drawer)/help/contact-support');
  };

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.appInfo}>
        <View style={s.appIcon}>
          <Text style={s.appIconText}>wiweeb</Text>
        </View>
        <Text style={s.appName}>{t('about.appName')}</Text>
        <Text style={s.appVersion}>{t('about.version')}</Text>
      </View>

      <View style={s.card}>
        {LINK_KEYS.map((key, i) => (
          <TouchableOpacity
            key={key}
            style={[s.row, i > 0 && s.rowBorder]}
            onPress={() => handleLink(key)}
            activeOpacity={0.7}
          >
            <Text style={s.rowLabel}>{t(`about.links.${key}`)}</Text>
            <AppIcon
              type="Feather"
              name="chevron-right"
              symbol="chevron.right"
              size={18}
              color={theme.onSurfaceVariant}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.copyright}>{t('about.copyright')}</Text>
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
      alignItems: 'stretch',
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    appIcon: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.xl,
      backgroundColor: '#f59e0b',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    appIconText: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.bold,
      color: '#fff',
      letterSpacing: -0.5,
    },
    appName: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.semibold,
      color: theme.onSurface,
    },
    appVersion: {
      fontSize: typography.sizes.sm,
      color: theme.onSurfaceVariant,
      marginTop: spacing.xs,
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
    rowLabel: {
      flex: 1,
      fontSize: typography.sizes.md,
      color: theme.onSurface,
    },
    copyright: {
      textAlign: 'center',
      fontSize: typography.sizes.xs,
      color: theme.onSurfaceVariant,
      marginTop: spacing.xl,
    },
  });
