import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { useAppSelector } from '../../../store/hooks';
import { selectActiveOrganizationId } from '../../../features/organizations/slice/organizationSlice';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../../features/users/api/usersApi';
import {
  ASSIGNABLE_ROLE_LABELS,
  orgRoleOf,
  orgRoleToBooleans,
  deriveRole,
  type AssignableRole,
} from '../../../features/auth/rbac';
import { useCan } from '../../../features/auth/hooks/useRbac';
import { RoleBadge, StatusBadge } from '../../../features/users/components/UserBadges';

const ROLES: AssignableRole[] = ['admin', 'viewer'];

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation('users');
  const { theme } = useTheme();
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const canManageRoles = useCan('manage_roles');

  const { data: user, isLoading } = useGetUserByIdQuery(id!);
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation();

  const [pendingRole, setPendingRole] = useState<AssignableRole | null>(null);

  if (isLoading || !user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const currentRole = activeOrgId ? orgRoleOf(user, activeOrgId) : 'viewer';
  const selectedRole = pendingRole ?? currentRole;

  const changeRole = async (role: AssignableRole) => {
    if (!activeOrgId || role === currentRole) {
      setPendingRole(role);
      return;
    }
    setPendingRole(role);
    const combo = orgRoleToBooleans(role, activeOrgId);
    try {
      await updateUser({
        id: user.id,
        patch: { organization_users: combo.organization_users },
      }).unwrap();
      Alert.alert(t('detail.roleUpdated'));
    } catch {
      setPendingRole(currentRole);
      Alert.alert(t('detail.roleError'));
    }
  };

  const resend = async () => {
    // Mock resend: re-stamp pending status (a real backend would re-send email).
    try {
      await updateUser({ id: user.id, patch: { status: 'pending' } }).unwrap();
      Alert.alert(t('detail.resent'));
    } catch {
      Alert.alert(t('detail.roleError'));
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[typography.variants.headlineSmall, { color: theme.onSurface }]}>
        {user.first_name || user.last_name
          ? `${user.first_name} ${user.last_name}`.trim()
          : user.username}
      </Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant }]}>
        {user.email}
      </Text>
      <View style={styles.badges}>
        <RoleBadge role={deriveRole(user)} />
        <StatusBadge status={user.status ?? 'active'} />
      </View>

      {canManageRoles ? (
        <View style={styles.section}>
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
            {t('detail.changeRole')}
          </Text>
          <View style={styles.roles}>
            {ROLES.map((r) => {
              const selected = r === selectedRole;
              return (
                <Pressable
                  key={r}
                  onPress={() => changeRole(r)}
                  disabled={saving}
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
        </View>
      ) : null}

      {(user.status ?? 'active') === 'pending' ? (
        <Pressable
          onPress={resend}
          disabled={saving}
          style={[styles.btnOutline, { borderColor: theme.primary }]}
        >
          <Text style={[typography.variants.labelLarge, { color: theme.primary }]}>
            {t('detail.resend')}
          </Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
  section: { marginTop: spacing.xl, gap: spacing.sm },
  roles: { flexDirection: 'row', gap: spacing.sm },
  roleChip: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
