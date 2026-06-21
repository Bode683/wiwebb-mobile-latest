import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { useAppSelector } from '../../../store/hooks';
import { selectActiveOrganizationId } from '../../../features/organizations/slice/organizationSlice';
import { useCreateUserMutation } from '../../../features/users/api/usersApi';
import {
  ASSIGNABLE_ROLE_LABELS,
  orgRoleToBooleans,
  type AssignableRole,
} from '../../../features/auth/rbac';
import { uuid } from '../../../features/users/utils/ids';

const ROLES: AssignableRole[] = ['admin', 'viewer'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteUserScreen() {
  const { t } = useTranslation('users');
  const { theme } = useTheme();
  const router = useRouter();
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AssignableRole>('viewer');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError(t('invite.invalidEmail'));
      return;
    }
    if (!activeOrgId) return;

    const combo = orgRoleToBooleans(role, activeOrgId);
    try {
      await createUser({
        id: uuid(),
        username: trimmed,
        email: trimmed,
        status: 'pending',
        invite_token: uuid(),
        is_active: false,
        is_staff: combo.is_staff,
        is_superuser: combo.is_superuser,
        organization_users: combo.organization_users,
      }).unwrap();
      Alert.alert(t('invite.success'));
      router.back();
    } catch {
      setError(t('invite.error'));
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
        {t('invite.emailLabel')}
      </Text>
      <TextInput
        style={[styles.input, { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surface }]}
        placeholder={t('invite.emailPlaceholder')}
        placeholderTextColor={theme.onSurfaceVariant}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!isLoading}
      />

      <Text style={[typography.variants.labelLarge, { color: theme.onSurface, marginTop: spacing.lg }]}>
        {t('invite.roleLabel')}
      </Text>
      <View style={styles.roles}>
        {ROLES.map((r) => {
          const selected = r === role;
          return (
            <Pressable
              key={r}
              onPress={() => setRole(r)}
              style={[
                styles.roleChip,
                {
                  borderColor: selected ? theme.primary : theme.outline,
                  backgroundColor: selected ? theme.primaryContainer : theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  typography.variants.labelLarge,
                  { color: selected ? theme.onPrimaryContainer ?? theme.primary : theme.onSurface },
                ]}
              >
                {ASSIGNABLE_ROLE_LABELS[r]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <Text style={[typography.variants.bodySmall, { color: theme.error, marginTop: spacing.md }]}>
          {error}
        </Text>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        disabled={isLoading}
        style={[styles.btn, { backgroundColor: theme.primary, opacity: isLoading ? 0.6 : 1 }]}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('invite.submit')}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  roles: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  roleChip: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
