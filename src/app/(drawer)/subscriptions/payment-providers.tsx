import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
  Pressable,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { useGetPaymentProvidersQuery, useUpdatePaymentProviderMutation } from '../../../features/payment-providers/api/paymentProvidersApi';
import { useVisibleOrganizations } from '../../../features/organizations/hooks/useVisibleOrganizations';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../features/auth/slice/authSlice';
import { selectActiveOrganizationId } from '../../../features/organizations/slice/organizationSlice';
import { useCan } from '../../../features/auth/hooks/useRbac';
import type { PaymentProvider, ProviderKey } from '../../../types/api';

const PROVIDER_ICON: Record<ProviderKey, { name: string; symbol: string }> = {
  'mtn-momo':     { name: 'smartphone',  symbol: 'iphone' },
  'orange-money': { name: 'smartphone',  symbol: 'iphone' },
  'card':         { name: 'credit-card', symbol: 'creditcard' },
};

export default function PaymentProvidersScreen() {
  const { t } = useTranslation('payment-providers');
  const { theme } = useTheme();
  const router = useRouter();
  const me = useAppSelector(selectUser);
  const globalActiveOrgId = useAppSelector(selectActiveOrganizationId);
  const canManage = useCan('manage_payment_methods');

  // Superusers get a local org picker; regular admins always use the global active org.
  const isSuperuser = !!me?.is_superuser;
  const { organizations } = useVisibleOrganizations();
  const [pickerOrgId, setPickerOrgId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Which org's providers to show
  const scopeOrgId = isSuperuser
    ? (pickerOrgId ?? globalActiveOrgId ?? organizations[0]?.id ?? null)
    : globalActiveOrgId;

  const pickerOrgName =
    organizations.find((o) => o.id === scopeOrgId)?.name ?? t('list.selectOrg');

  const { data, isLoading, isFetching, isError, refetch } = useGetPaymentProvidersQuery(
    { organization: scopeOrgId },
  );

  const providers = useMemo<PaymentProvider[]>(() => {
    const all = data?.results ?? [];
    if (!scopeOrgId) return all;
    return all.filter((p) => p.organization === scopeOrgId);
  }, [data, scopeOrgId]);

  const [updateProvider] = useUpdatePaymentProviderMutation();

  const handleToggle = useCallback(
    async (provider: PaymentProvider) => {
      try {
        await updateProvider({ id: provider.id, patch: { enabled: !provider.enabled } }).unwrap();
      } catch {
        Alert.alert(t('toggleError'));
      }
    },
    [updateProvider, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: PaymentProvider }) => {
      const icon = PROVIDER_ICON[item.provider] ?? { name: 'dollar-sign', symbol: 'dollarsign' };
      return (
        <Pressable
          onPress={() =>
            canManage
              ? router.push(`/(drawer)/subscriptions/provider-form?id=${item.id}` as any)
              : undefined
          }
          style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}
        >
          <View
            style={[
              styles.providerIcon,
              { backgroundColor: item.enabled ? theme.primaryContainer : theme.surfaceVariant },
            ]}
          >
            <AppIcon
              type="Feather"
              name={icon.name}
              symbol={icon.symbol}
              size={20}
              color={item.enabled ? theme.primary : theme.onSurfaceVariant}
            />
          </View>

          <View style={styles.rowMain}>
            <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
              {item.display_name}
            </Text>
            <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
              {item.enabled ? t('enabled') : t('disabled')}
            </Text>
          </View>

          {canManage ? (
            <>
              <Switch
                value={item.enabled}
                onValueChange={() => handleToggle(item)}
                trackColor={{ true: theme.primary }}
              />
              <AppIcon
                type="Feather"
                name="chevron-right"
                symbol="chevron.right"
                size={18}
                color={theme.onSurfaceVariant}
              />
            </>
          ) : (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.enabled ? theme.primaryContainer : theme.surfaceVariant },
              ]}
            >
              <Text
                style={[
                  typography.variants.labelSmall,
                  { color: item.enabled ? theme.primary : theme.onSurfaceVariant },
                ]}
              >
                {item.enabled ? t('enabled') : t('disabled')}
              </Text>
            </View>
          )}
        </Pressable>
      );
    },
    [router, theme, t, canManage, handleToggle],
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
      {/* Org picker — superuser only */}
      {isSuperuser && organizations.length > 1 && (
        <Pressable
          onPress={() => setShowPicker(true)}
          style={[styles.orgPicker, { backgroundColor: theme.surface, borderColor: theme.outline }]}
        >
          <AppIcon type="Feather" name="filter" symbol="line.3.horizontal.decrease" size={16} color={theme.primary} />
          <Text style={[typography.variants.bodyMedium, { color: theme.onSurface, flex: 1 }]}>
            {pickerOrgName}
          </Text>
          <AppIcon type="Feather" name="chevron-down" symbol="chevron.down" size={16} color={theme.onSurfaceVariant} />
        </Pressable>
      )}

      <FlatList
        data={providers}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <Text
            style={[typography.variants.bodyMedium, styles.empty, { color: theme.onSurfaceVariant }]}
          >
            {isError
              ? t('list.error')
              : !scopeOrgId
                ? t('list.noActiveOrg')
                : t('list.empty')}
          </Text>
        }
      />

      {/* Org picker modal */}
      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowPicker(false)} />
        <View style={styles.pickerCenter} pointerEvents="box-none">
          <View style={[styles.pickerCard, { backgroundColor: theme.surface }]}>
            <Text style={[typography.variants.titleMedium, { color: theme.onSurface, marginBottom: spacing.sm }]}>
              {t('list.selectOrg')}
            </Text>
            {organizations.map((org) => (
              <Pressable
                key={org.id}
                onPress={() => { setPickerOrgId(org.id); setShowPicker(false); }}
                style={[
                  styles.pickerItem,
                  {
                    backgroundColor: org.id === scopeOrgId ? theme.primaryContainer : 'transparent',
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.variants.bodyMedium,
                    { color: org.id === scopeOrgId ? theme.primary : theme.onSurface },
                  ]}
                >
                  {org.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orgPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    margin: spacing.md,
    marginBottom: 0,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  listContent: { padding: spacing.md, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  providerIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { flex: 1, gap: 2 },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  empty: { textAlign: 'center', marginTop: spacing['2xl'], paddingHorizontal: spacing.lg },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  pickerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  pickerCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  pickerItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
