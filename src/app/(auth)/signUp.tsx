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

export default function SignUpScreen() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, status } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLoading = status === 'loading';

  const handleSignUp = async () => {
    setError('');
    try {
      // In dev/mock mode, sign up just calls login directly.
      // In production this would call a registration endpoint first.
      await login(email.trim(), password);
    } catch {
      setError(t('signUp.error'));
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
          {t('signUp.title')}
        </Text>
        <Text
          style={[
            typography.variants.bodyMedium,
            { color: theme.onSurfaceVariant, marginTop: spacing.xs },
          ]}
        >
          {t('signUp.subtitle')}
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
            placeholder={t('signUp.namePlaceholder')}
            placeholderTextColor={theme.onSurfaceVariant}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
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
            placeholder={t('signUp.emailPlaceholder')}
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
            placeholder={t('signUp.passwordPlaceholder')}
            placeholderTextColor={theme.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            editable={!isLoading}
          />

          {error ? (
            <Text style={[typography.variants.bodySmall, { color: theme.error }]}>
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSignUp}
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
                {t('signUp.submit')}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/login' as any)} style={styles.link}>
          <Text style={[typography.variants.bodySmall, { color: theme.primary }]}>
            {t('signUp.hasAccount')}
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
