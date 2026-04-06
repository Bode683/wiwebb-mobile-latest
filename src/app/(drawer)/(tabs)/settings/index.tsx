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

type SettingItem = {
  key: string;
  label: string;
  icon: string;
  symbol: string;
  route: string;
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');
  const router = useRouter();

  const accountItems: SettingItem[] = [
    { key: 'profile',        label: t('items.profile'),        icon: 'user',        symbol: 'person',      route: '/(drawer)/(tabs)/settings/profile'       },
    { key: 'security',       label: t('items.security'),       icon: 'shield',      symbol: 'lock.shield', route: '/(drawer)/(tabs)/settings/security'      },
    { key: 'paymentMethods', label: t('items.paymentMethods'), icon: 'credit-card', symbol: 'creditcard',  route: '/(drawer)/(tabs)/settings/payment-methods'},
    { key: 'notifications',  label: t('items.notifications'),  icon: 'bell',        symbol: 'bell',        route: '/(drawer)/(tabs)/settings/notifications'  },
    { key: 'appearance',     label: t('items.appearance'),     icon: 'sun',         symbol: 'sun.min',     route: '/(drawer)/(tabs)/settings/appearance'     },
    { key: 'language',       label: t('items.language'),       icon: 'globe',       symbol: 'globe',       route: '/(drawer)/(tabs)/settings/language'       },
  ];

  const moreItems: SettingItem[] = [
    { key: 'toolkit', label: t('items.toolkit'), icon: 'tool',  symbol: 'wrench',       route: '/(drawer)/(tabs)/settings/toolkit' },
    { key: 'about',   label: t('items.about'),   icon: 'info',  symbol: 'info.circle',  route: '/(drawer)/(tabs)/settings/about'   },
  ];

  const s = styles(theme);

  const renderItem = (item: SettingItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.key}
      style={[s.row, !isLast && s.rowBorder]}
      onPress={() => router.push(item.route as any)}
      activeOpacity={0.7}
    >
      <View style={s.rowIcon}>
        <AppIcon type="Feather" name={item.icon} symbol={item.symbol} size={20} color={theme.onSurfaceVariant} />
      </View>
      <Text style={s.rowLabel}>{item.label}</Text>
      <AppIcon type="Feather" name="chevron-right" symbol="chevron.right" size={18} color={theme.onSurfaceVariant} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.sectionHeader}>{t('sections.account').toUpperCase()}</Text>
      <View style={s.card}>
        {accountItems.map((item, i) => renderItem(item, i === accountItems.length - 1))}
      </View>

      <Text style={s.sectionHeader}>{t('sections.more').toUpperCase()}</Text>
      <View style={s.card}>
        {moreItems.map((item, i) => renderItem(item, i === moreItems.length - 1))}
      </View>

      <TouchableOpacity style={s.signOutButton} activeOpacity={0.7}>
        <AppIcon type="Feather" name="log-out" symbol="rectangle.portrait.and.arrow.right" size={18} color={theme.error} />
        <Text style={s.signOutText}>{t('signOut')}</Text>
      </TouchableOpacity>
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
      marginTop: spacing.md,
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
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.outline,
    },
    rowIcon: {
      width: 32,
      alignItems: 'center',
    },
    rowLabel: {
      flex: 1,
      fontSize: typography.sizes.md,
      color: theme.onSurface,
      marginLeft: spacing.sm,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginTop: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.error,
    },
    signOutText: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.medium,
      color: theme.error,
    },
  });
