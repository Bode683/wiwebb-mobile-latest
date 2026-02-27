import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, typography, spacing, borderRadius } from '../../theme';
import SvgLogo from '../../assets/brand-logo/wiweeb-orange.svg';
import AuthBgDark from '../../assets/common/auth-background-dark.svg';
import AuthBgLight from '../../assets/common/auth-background-light.svg';

const { width, height } = Dimensions.get('screen');

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation('auth');
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <View style={styles.container}>
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

      <View style={[styles.inner, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.hero}>
          <SvgLogo width={200} height={68} />
          <Text
            style={[
              typography.variants.bodyLarge,
              { color: isDark ? theme.onSurfaceVariant : theme.onSurfaceVariant, marginTop: spacing.md, textAlign: 'center' },
            ]}
          >
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
            style={[styles.secondaryBtn, { borderColor: theme.outline, backgroundColor: theme.surface + 'CC' }]}
          >
            <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
              {t('welcome.signUp')}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={toggleLang} style={styles.langToggle}>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {i18n.language === 'en' ? 'Français' : 'English'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtn: {
    height: 52,
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
