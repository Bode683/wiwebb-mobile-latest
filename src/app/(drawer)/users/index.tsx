import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { RoleGate } from '../../../features/auth/components/RoleGate';
import { useOrgUsers } from '../../../features/users/hooks/useOrgUsers';
import { deriveRole } from '../../../features/auth/rbac';
import { RoleBadge, StatusBadge } from '../../../features/users/components/UserBadges';
import type { User } from '../../../types/api';

export default function UsersScreen() {
  const { t } = useTranslation('users');
  const { theme } = useTheme();
  const router = useRouter();
  const { users, isLoading, isFetching, isError, refetch, activeOrgId } =
    useOrgUsers();

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <Pressable
        onPress={() => router.push(`/(drawer)/users/${item.id}` as any)}
        style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}
      >
        <View style={styles.rowMain}>
          <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
            {item.first_name || item.last_name
              ? `${item.first_name} ${item.last_name}`.trim()
              : item.username}
          </Text>
          <Text
            style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {item.email}
          </Text>
          <View style={styles.badges}>
            <RoleBadge role={deriveRole(item)} />
            <StatusBadge status={item.status ?? 'active'} />
          </View>
        </View>
        <AppIcon type="Feather" name="chevron-right" symbol="chevron.right" size={20} color={theme.onSurfaceVariant} />
      </Pressable>
    ),
    [router, theme],
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <Text style={[typography.variants.bodyMedium, styles.empty, { color: theme.onSurfaceVariant }]}>
            {isError
              ? t('list.error')
              : !activeOrgId
                ? t('list.noActiveOrg')
                : t('list.empty')}
          </Text>
        }
      />

      <RoleGate action="manage_users">
        <Pressable
          onPress={() => router.push('/(drawer)/users/invite' as any)}
          style={[styles.fab, { backgroundColor: theme.primary }]}
        >
          <AppIcon type="Feather" name="plus" symbol="plus" size={20} color={theme.onPrimary} />
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('list.invite')}
          </Text>
        </Pressable>
      </RoleGate>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing['3xl'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  rowMain: { flex: 1, gap: 4 },
  badges: { flexDirection: 'row', gap: spacing.xs, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: spacing['2xl'], paddingHorizontal: spacing.lg },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderRadius: borderRadius.full ?? 24,
    elevation: 3,
  },
});
