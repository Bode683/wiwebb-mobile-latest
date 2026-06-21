import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { useOrgOrders } from '../../../features/orders/hooks/useOrgOrders';
import type { EmbeddedPayment, Order, PaymentStatus } from '../../../types/api';

type PaymentRow = EmbeddedPayment & {
  order_reference: string;
  amount: number;
  currency: string;
};

const PAY_STATUS_BG: Record<PaymentStatus, 'primaryContainer' | 'errorContainer' | 'surfaceVariant'> = {
  success: 'primaryContainer',
  pending: 'surfaceVariant',
  failed:  'errorContainer',
};
const PAY_STATUS_FG: Record<PaymentStatus, 'primary' | 'error' | 'onSurfaceVariant'> = {
  success: 'primary',
  pending: 'onSurfaceVariant',
  failed:  'error',
};

export default function PaymentsScreen() {
  const { t } = useTranslation('orders');
  const { theme } = useTheme();
  const { orders, isLoading, isFetching, isError, refetch, activeOrgId } = useOrgOrders();

  const payments = useMemo<PaymentRow[]>(
    () =>
      orders.map((o: Order) => ({
        ...o.payment,
        order_reference: o.reference,
        amount: o.amount,
        currency: o.currency,
      })),
    [orders],
  );

  const renderItem = useCallback(
    ({ item }: { item: PaymentRow }) => (
      <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <View style={[styles.iconWrap, { backgroundColor: theme.primaryContainer }]}>
          <AppIcon
            type="Feather"
            name="dollar-sign"
            symbol="banknote"
            size={18}
            color={theme.primary}
          />
        </View>

        <View style={styles.rowMain}>
          <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
            {item.order_reference}
          </Text>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {item.provider_name}
            {item.transaction_id ? ` · ${item.transaction_id}` : ''}
          </Text>
          {item.paid_at ? (
            <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
              {new Date(item.paid_at).toLocaleDateString()}
            </Text>
          ) : null}
        </View>

        <View style={styles.rowRight}>
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
            {item.amount.toLocaleString()} {item.currency}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme[PAY_STATUS_BG[item.status]] }]}>
            <Text
              style={[
                typography.variants.labelSmall,
                { color: theme[PAY_STATUS_FG[item.status]] },
              ]}
            >
              {t(`payment.status.${item.status}`)}
            </Text>
          </View>
        </View>
      </View>
    ),
    [theme, t],
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
        data={payments}
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
              : !activeOrgId
                ? t('list.noActiveOrg')
                : t('list.empty')}
          </Text>
        }
      />
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { flex: 1, gap: 2 },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  empty: { textAlign: 'center', marginTop: spacing['2xl'], paddingHorizontal: spacing.lg },
});
