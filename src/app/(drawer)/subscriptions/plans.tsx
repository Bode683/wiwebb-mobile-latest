/**
 * Admin plan configuration screen (Phase 4).
 *
 * The previous subscribe/checkout UI (tier picker + confirm modal) has been
 * lifted out and will live in the captive portal (next effort). It's
 * preserved in git history on this file before this commit.
 */
import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { RoleGate } from '../../../features/auth/components/RoleGate';
import { useOrgPlans } from '../../../features/plans/hooks/useOrgPlans';
import { useUpdatePlanMutation, useDeletePlanMutation } from '../../../features/plans/api/plansApi';
import { useCan } from '../../../features/auth/hooks/useRbac';
import type { Plan } from '../../../types/api';

export default function PlansScreen() {
  const { t } = useTranslation('plans');
  const { theme } = useTheme();
  const router = useRouter();
  const { plans, isLoading, isFetching, isError, refetch, activeOrgId } = useOrgPlans();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const canManage = useCan('manage_plans');

  const handleToggleActive = useCallback(
    async (plan: Plan) => {
      try {
        await updatePlan({ id: plan.id, patch: { is_active: !plan.is_active } }).unwrap();
      } catch {
        Alert.alert(t('form.error'));
      }
    },
    [updatePlan, t],
  );

  const handleDelete = useCallback(
    (plan: Plan) => {
      Alert.alert(t('detail.deleteConfirm'), t('detail.deleteMessage'), [
        { text: t('detail.deleteCancel'), style: 'cancel' },
        {
          text: t('detail.deleteOk'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlan(plan.id).unwrap();
            } catch {
              Alert.alert(t('detail.deleteError'));
            }
          },
        },
      ]);
    },
    [deletePlan, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: Plan }) => (
      <Pressable
        onPress={() =>
          canManage
            ? router.push(`/(drawer)/subscriptions/plan-form?id=${item.id}` as any)
            : undefined
        }
        style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}
      >
        {/* Family badge */}
        <View
          style={[
            styles.familyBadge,
            { backgroundColor: item.family === 'FPU' ? theme.primaryContainer : theme.secondaryContainer },
          ]}
        >
          <Text
            style={[
              typography.variants.labelSmall,
              { color: item.family === 'FPU' ? theme.primary : theme.secondary },
            ]}
          >
            {item.family}
          </Text>
        </View>

        <View style={styles.rowMain}>
          <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
            {item.name}
          </Text>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {item.price.toLocaleString()} {item.currency}
            {item.duration ? ` / ${t(`duration.${item.duration}`)}` : ''}
            {` · ${item.speed_cap} Mbps`}
          </Text>
        </View>

        {canManage ? (
          <Switch
            value={item.is_active}
            onValueChange={() => handleToggleActive(item)}
            trackColor={{ true: theme.primary }}
          />
        ) : (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.is_active ? theme.primaryContainer : theme.surfaceVariant },
            ]}
          >
            <Text
              style={[
                typography.variants.labelSmall,
                { color: item.is_active ? theme.primary : theme.onSurfaceVariant },
              ]}
            >
              {t(item.is_active ? 'status.active' : 'status.inactive')}
            </Text>
          </View>
        )}

        {canManage ? (
          <Pressable onPress={() => handleDelete(item)} hitSlop={8} style={styles.deleteBtn}>
            <AppIcon type="Feather" name="trash-2" symbol="trash" size={18} color={theme.error} />
          </Pressable>
        ) : null}
      </Pressable>
    ),
    [router, theme, t, canManage, handleToggleActive, handleDelete],
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
        data={plans}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <Text
            style={[
              typography.variants.bodyMedium,
              styles.empty,
              { color: theme.onSurfaceVariant },
            ]}
          >
            {isError
              ? t('list.error')
              : !activeOrgId
                ? t('list.noActiveOrg')
                : t('list.empty')}
          </Text>
        }
      />

      <RoleGate action="manage_plans">
        <Pressable
          onPress={() => router.push('/(drawer)/subscriptions/plan-form' as any)}
          style={[styles.fab, { backgroundColor: theme.primary }]}
        >
          <AppIcon type="Feather" name="plus" symbol="plus" size={20} color={theme.onPrimary} />
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('list.add')}
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
  familyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  rowMain: { flex: 1, gap: 2 },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  deleteBtn: { padding: 4 },
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
    borderRadius: borderRadius.full,
    elevation: 3,
  },
});
