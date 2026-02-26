import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, typography, spacing, borderRadius } from '../../theme';
import SvgLogo from '../../assets/brand-logo/wiwebb-orange.svg';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation('auth');
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top + spacing.xl },
      ]}
    >
      <View style={styles.hero}>
        <SvgLogo width={180} height={60} />
        <Text style={[typography.variants.bodyLarge, { color: theme.onSurfaceVariant, marginTop: spacing.md }]}>
          {t('welcome.tagline')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/login' as any)}
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('welcome.login')}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/signUp' as any)}
          style={[styles.secondaryBtn, { borderColor: theme.outline }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
            {t('welcome.signUp')}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={toggleLang} style={styles.langToggle}>
        <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
          {i18n.language === 'en' ? 'Fran\u00e7ais' : 'English'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  primaryBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langToggle: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
});
