import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTheme, typography, spacing, borderRadius } from '../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, status } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLoading = status === 'loading';

  const handleLogin = async () => {
    setError('');
    try {
      await login(email.trim(), password);
      // AuthBootstrap handles redirect
    } catch {
      setError(t('login.error'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing['2xl'] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[typography.variants.headlineSmall, { color: theme.onSurface }]}>
          {t('login.title')}
        </Text>
        <Text
          style={[
            typography.variants.bodyMedium,
            { color: theme.onSurfaceVariant, marginTop: spacing.xs },
          ]}
        >
          {t('login.subtitle')}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.onSurface,
                borderColor: theme.outline,
                backgroundColor: theme.surface,
              },
            ]}
            placeholder={t('login.emailPlaceholder')}
            placeholderTextColor={theme.onSurfaceVariant}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isLoading}
          />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.onSurface,
                borderColor: theme.outline,
                backgroundColor: theme.surface,
              },
            ]}
            placeholder={t('login.passwordPlaceholder')}
            placeholderTextColor={theme.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!isLoading}
          />

          {error ? (
            <Text style={[typography.variants.bodySmall, { color: theme.error }]}>
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={[
              styles.btn,
              { backgroundColor: theme.primary, opacity: isLoading ? 0.6 : 1 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
                {t('login.submit')}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/signUp' as any)} style={styles.link}>
          <Text style={[typography.variants.bodySmall, { color: theme.primary }]}>
            {t('login.noAccount')}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
  },
  btn: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  link: {
    marginTop: spacing.lg,
    alignSelf: 'center',
    padding: spacing.sm,
  },
});
