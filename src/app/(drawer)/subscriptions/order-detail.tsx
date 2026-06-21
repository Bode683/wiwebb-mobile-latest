import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import { useGetOrderByIdQuery } from '../../../features/orders/api/ordersApi';
import type { OrderStatus, PaymentStatus } from '../../../types/api';

const ORDER_STATUS_BG: Record<OrderStatus, 'primaryContainer' | 'errorContainer' | 'surfaceVariant'> = {
  completed: 'primaryContainer',
  pending:   'surfaceVariant',
  failed:    'errorContainer',
};
const ORDER_STATUS_FG: Record<OrderStatus, 'primary' | 'error' | 'onSurfaceVariant'> = {
  completed: 'primary',
  pending:   'onSurfaceVariant',
  failed:    'error',
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

export default function OrderDetailScreen() {
  const { t } = useTranslation('orders');
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrderByIdQuery(id);

  if (isLoading || !order) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={[typography.variants.labelMedium, { color: theme.onSurfaceVariant }]}>{label}</Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurface, textAlign: 'right', flex: 1 }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.content}>
      {/* Order card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <View style={styles.cardHeader}>
          <Text style={[typography.variants.titleMedium, { color: theme.onSurface }]}>
            {order.reference}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme[ORDER_STATUS_BG[order.status]] }]}>
            <Text style={[typography.variants.labelSmall, { color: theme[ORDER_STATUS_FG[order.status]] }]}>
              {t(`status.${order.status}`)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.outline }]} />

        <Row label={t('detail.plan')} value={order.plan_name} />
        <Row label={t('detail.user')} value={order.user_email} />
        <Row label={t('detail.amount')} value={`${order.amount.toLocaleString()} ${order.currency}`} />
        <Row label={t('detail.reference')} value={order.reference} />
        <Row label="Created" value={new Date(order.created).toLocaleString()} />
      </View>

      {/* Payment card */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <View style={styles.cardHeader}>
          <Text style={[typography.variants.titleSmall, { color: theme.onSurface }]}>
            {t('payment.title')}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme[PAY_STATUS_BG[order.payment.status]] }]}>
            <Text style={[typography.variants.labelSmall, { color: theme[PAY_STATUS_FG[order.payment.status]] }]}>
              {t(`payment.status.${order.payment.status}`)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.outline }]} />

        <Row label={t('detail.paymentMethod')} value={order.payment.provider_name} />
        <Row
          label={t('detail.transactionId')}
          value={order.payment.transaction_id ?? t('detail.none')}
        />
        <Row
          label={t('detail.paidAt')}
          value={order.payment.paid_at ? new Date(order.payment.paid_at).toLocaleString() : t('detail.none')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing['3xl'] },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: StyleSheet.hairlineWidth },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm },
});
