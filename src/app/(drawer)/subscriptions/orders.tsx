import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { AppIcon } from '../../../components/AppIcon';
import { useOrgOrders } from '../../../features/orders/hooks/useOrgOrders';
import type { Order, OrderStatus } from '../../../types/api';

const STATUS_COLOR: Record<OrderStatus, 'primaryContainer' | 'errorContainer' | 'surfaceVariant'> = {
  completed: 'primaryContainer',
  pending:   'surfaceVariant',
  failed:    'errorContainer',
};

const STATUS_TEXT_COLOR: Record<OrderStatus, 'primary' | 'error' | 'onSurfaceVariant'> = {
  completed: 'primary',
  pending:   'onSurfaceVariant',
  failed:    'error',
};

export default function OrdersScreen() {
  const { t } = useTranslation('orders');
  const { theme } = useTheme();
  const router = useRouter();
  const { orders, isLoading, isFetching, isError, refetch, activeOrgId } = useOrgOrders();

  const renderItem = useCallback(
    ({ item }: { item: Order }) => (
      <Pressable
        onPress={() => router.push(`/(drawer)/subscriptions/order-detail?id=${item.id}` as any)}
        style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.outline }]}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.primaryContainer }]}>
          <AppIcon
            type="Feather"
            name="shopping-bag"
            symbol="bag"
            size={18}
            color={theme.primary}
          />
        </View>

        <View style={styles.rowMain}>
          <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
            {item.reference}
          </Text>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {item.plan_name} · {item.amount.toLocaleString()} {item.currency}
          </Text>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {item.user_email}
          </Text>
        </View>

        <View style={styles.rowRight}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme[STATUS_COLOR[item.status]] },
            ]}
          >
            <Text
              style={[
                typography.variants.labelSmall,
                { color: theme[STATUS_TEXT_COLOR[item.status]] },
              ]}
            >
              {t(`status.${item.status}`)}
            </Text>
          </View>
          <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant }]}>
            {new Date(item.created).toLocaleDateString()}
          </Text>
        </View>

        <AppIcon
          type="Feather"
          name="chevron-right"
          symbol="chevron.right"
          size={18}
          color={theme.onSurfaceVariant}
        />
      </Pressable>
    ),
    [router, theme, t],
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
        data={orders}
        keyExtractor={(o) => o.id}
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
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  empty: { textAlign: 'center', marginTop: spacing['2xl'], paddingHorizontal: spacing.lg },
});
