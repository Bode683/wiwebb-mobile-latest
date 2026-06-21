import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../../features/users/api/usersApi';

export default function AcceptInviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { t } = useTranslation('users');
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading: loadingUsers } = useGetUsersQuery();
  const [updateUser, { isLoading: activating }] = useUpdateUserMutation();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const invitee = useMemo(
    () =>
      (data?.results ?? []).find(
        (u) => u.invite_token && u.invite_token === token && u.status === 'pending',
      ),
    [data, token],
  );

  if (loadingUsers) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!invitee && !done) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[typography.variants.bodyLarge, { color: theme.error, textAlign: 'center', paddingHorizontal: spacing.lg }]}>
          {t('accept.invalid')}
        </Text>
      </View>
    );
  }

  const submit = async () => {
    setError('');
    if (password.length < 8) {
      setError(t('accept.tooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('accept.mismatch'));
      return;
    }
    try {
      await updateUser({
        id: invitee!.id,
        patch: { status: 'active', is_active: true, invite_token: null, email_verified: true },
      }).unwrap();
      setDone(true);
    } catch {
      setError(t('accept.error'));
    }
  };

  if (done) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[typography.variants.titleMedium, { color: theme.onSurface, textAlign: 'center', paddingHorizontal: spacing.lg }]}>
          {t('accept.success')}
        </Text>
        <Pressable
          onPress={() => router.replace('/(auth)/login' as any)}
          style={[styles.btn, { backgroundColor: theme.primary, marginTop: spacing.lg }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('accept.title')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface }]}>
        {t('accept.title')}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        {t('accept.subtitle')}
      </Text>
      <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant, marginTop: spacing.sm }]}>
        {invitee?.email}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface }]}
          placeholder={t('accept.passwordPlaceholder')}
          placeholderTextColor={theme.onSurfaceVariant}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!activating}
        />
        <TextInput
          style={[styles.input, { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface }]}
          placeholder={t('accept.confirmLabel')}
          placeholderTextColor={theme.onSurfaceVariant}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          editable={!activating}
        />

        {error ? (
          <Text style={[typography.variants.bodySmall, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={activating}
          style={[styles.btn, { backgroundColor: theme.primary, opacity: activating ? 0.6 : 1 }]}
        >
          {activating ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
              {t('accept.submit')}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  form: { marginTop: spacing.xl, gap: spacing.md },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
