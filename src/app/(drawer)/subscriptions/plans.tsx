import React, { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppIcon } from '../../../components/AppIcon';
import { useAppSelector } from '../../../store/hooks';
import {
  PaymentMethod,
  selectDefaultPaymentMethod,
} from '../../../store/slices/paymentMethods';
import { borderRadius, spacing, useTheme } from '../../../theme';
import { typography } from '../../../theme/typography';

type DurationKey = 'daily' | 'weekly' | 'monthly';
type TierKey = 'basic' | 'standard' | 'premium';

interface Tier {
  key: TierKey;
  name: string;
  speed: number;
  features: string[];
  recommended?: boolean;
  prices: Record<DurationKey, number>;
}

const DURATIONS: { key: DurationKey; label: string }[] = [
  { key: 'daily',   label: 'Daily'   },
  { key: 'weekly',  label: 'Weekly'  },
  { key: 'monthly', label: 'Monthly' },
];

const TIERS: Tier[] = [
  {
    key: 'basic',
    name: 'Basic',
    speed: 5,
    features: ['Browsing & messaging', '1 device', 'Standard support'],
    prices: { daily: 500, weekly: 2500, monthly: 8000 },
  },
  {
    key: 'standard',
    name: 'Standard',
    speed: 10,
    recommended: true,
    features: ['HD streaming', '2 devices', 'Priority support'],
    prices: { daily: 1000, weekly: 5000, monthly: 15000 },
  },
  {
    key: 'premium',
    name: 'Premium',
    speed: 20,
    features: ['4K streaming & gaming', 'Up to 4 devices', '24/7 support'],
    prices: { daily: 2000, weekly: 9000, monthly: 25000 },
  },
];

const formatPrice = (xaf: number) => `${xaf.toLocaleString('en-US')} XAF`;

const paymentLabel = (m: PaymentMethod | null) => {
  if (!m) return 'No default payment method';
  switch (m.type) {
    case 'orange-money': return `Orange Money · ${m.phone}`;
    case 'mtn-momo':     return `MTN MoMo · ${m.phone}`;
    case 'card': {
      const last4 = m.cardNumber.replace(/\s+/g, '').slice(-4);
      return `Card •••• ${last4}`;
    }
  }
};

const paymentIcon = (m: PaymentMethod | null) => {
  if (!m) return { name: 'alert-circle', symbol: 'exclamationmark.circle' };
  if (m.type === 'card') return { name: 'credit-card', symbol: 'creditcard' };
  return { name: 'smartphone', symbol: 'iphone' };
};

export default function PlansScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const defaultMethod = useAppSelector(selectDefaultPaymentMethod);

  const [duration, setDuration] = useState<DurationKey>('daily');
  const [confirmTier, setConfirmTier] = useState<Tier | null>(null);

  const s = useMemo(() => createStyles(theme), [theme]);
  const icon = paymentIcon(defaultMethod);

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.intro}>
          <Text style={s.headline}>Choose your PassPlan</Text>
          <Text style={s.subline}>
            Fast, reliable Wi-Fi without commitments. Pay only for what you need.
          </Text>
        </View>

        <View style={s.tabs}>
          {DURATIONS.map((d) => {
            const active = duration === d.key;
            return (
              <TouchableOpacity
                key={d.key}
                onPress={() => setDuration(d.key)}
                activeOpacity={0.8}
                style={[s.tab, active && s.tabActive]}
              >
                <Text style={[s.tabText, active && s.tabTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.tierList}>
          {TIERS.map((tier) => (
            <View
              key={tier.key}
              style={[
                s.tierCard,
                tier.recommended && { borderColor: theme.primary, borderWidth: 2 },
              ]}
            >
              {tier.recommended && (
                <View style={[s.recommendBadge, { backgroundColor: theme.primary }]}>
                  <Text style={[s.recommendBadgeText, { color: theme.onPrimary }]}>
                    Most popular
                  </Text>
                </View>
              )}

              <View style={s.tierHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.tierName}>{tier.name}</Text>
                  <View style={s.speedRow}>
                    <AppIcon
                      type="Feather"
                      name="zap"
                      symbol="bolt.fill"
                      size={13}
                      color={theme.primary}
                    />
                    <Text style={s.speedText}>{tier.speed} Mbps</Text>
                  </View>
                </View>
                <View style={s.priceCol}>
                  <Text style={s.price}>{formatPrice(tier.prices[duration])}</Text>
                  <Text style={s.priceUnit}>/ {duration}</Text>
                </View>
              </View>

              <View style={s.divider} />

              <View style={s.featureList}>
                {tier.features.map((f) => (
                  <View key={f} style={s.featureRow}>
                    <AppIcon
                      type="Feather"
                      name="check"
                      symbol="checkmark"
                      size={14}
                      color={theme.primary}
                    />
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => setConfirmTier(tier)}
                android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
                style={({ pressed }) => [
                  s.buyBtn,
                  {
                    backgroundColor: tier.recommended ? theme.primary : theme.secondary,
                    opacity: Platform.OS === 'ios' && pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    s.buyBtnText,
                    { color: tier.recommended ? theme.onPrimary : theme.onSurface },
                  ]}
                >
                  Buy Now
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push('/(drawer)/(tabs)/settings/payment-methods')}
        android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
        style={({ pressed }) => [
          s.payBanner,
          { opacity: Platform.OS === 'ios' && pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[s.payIcon, { backgroundColor: theme.primaryContainer }]}>
          <AppIcon type="Feather" name={icon.name} symbol={icon.symbol} size={18} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.payLabel}>Pay via</Text>
          <Text style={s.payValue} numberOfLines={1}>{paymentLabel(defaultMethod)}</Text>
        </View>
        <AppIcon type="Feather" name="chevron-right" symbol="chevron.right" size={18} color={theme.onSurfaceVariant} />
      </Pressable>

      <ConfirmModal
        tier={confirmTier}
        duration={duration}
        method={defaultMethod}
        onClose={() => setConfirmTier(null)}
      />
    </View>
  );
}

interface ConfirmProps {
  tier: Tier | null;
  duration: DurationKey;
  method: PaymentMethod | null;
  onClose: () => void;
}

function ConfirmModal({ tier, duration, method, onClose }: ConfirmProps) {
  const { theme } = useTheme();
  const visible = !!tier;
  const [stage, setStage] = useState<'confirm' | 'success'>('confirm');

  const handleConfirm = () => setStage('success');
  const handleClose = () => {
    setStage('confirm');
    onClose();
  };

  if (!tier) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={modalStyles.backdrop} onPress={handleClose} />
      <View style={modalStyles.center} pointerEvents="box-none">
        <View style={[modalStyles.card, { backgroundColor: theme.surface }]}>
          {stage === 'confirm' ? (
            <>
              <View style={[modalStyles.icon, { backgroundColor: theme.primaryContainer }]}>
                <AppIcon type="Feather" name="shopping-bag" symbol="bag" size={26} color={theme.primary} />
              </View>
              <Text style={[modalStyles.title, { color: theme.onSurface }]}>
                Confirm purchase
              </Text>
              <Text style={[modalStyles.body, { color: theme.onSurfaceVariant }]}>
                {tier.name} · {tier.speed} Mbps{'\n'}
                {formatPrice(tier.prices[duration])} / {duration}
              </Text>
              <Text style={[modalStyles.payVia, { color: theme.onSurfaceVariant }]}>
                Pay with {paymentLabel(method)}
              </Text>

              <View style={modalStyles.row}>
                <Pressable onPress={handleClose} style={[modalStyles.btn, { borderColor: theme.outline, borderWidth: 1 }]}>
                  <Text style={[modalStyles.btnText, { color: theme.onSurface }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  disabled={!method}
                  style={[
                    modalStyles.btn,
                    { backgroundColor: theme.primary, opacity: method ? 1 : 0.4 },
                  ]}
                >
                  <Text style={[modalStyles.btnText, { color: theme.onPrimary }]}>
                    {method ? 'Confirm' : 'No method'}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={modalStyles.successIcon}>
                <AppIcon type="Feather" name="check" symbol="checkmark" size={36} color="#fff" />
              </View>
              <Text style={[modalStyles.title, { color: theme.onSurface }]}>
                Purchase complete!
              </Text>
              <Text style={[modalStyles.body, { color: theme.onSurfaceVariant }]}>
                Your <Text style={{ fontWeight: '700', color: theme.onSurface }}>{tier.name}</Text> · {tier.speed} Mbps pass is now active.{'\n'}Enjoy your connection!
              </Text>
              <Pressable onPress={handleClose} style={[modalStyles.btn, { backgroundColor: '#059669', alignSelf: 'stretch' }]}>
                <Text style={[modalStyles.btnText, { color: '#fff' }]}>Done</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.surfaceVariant },
    content: { padding: spacing.md, paddingBottom: 120, gap: spacing.md },
    intro: { gap: spacing.xs },
    headline: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: theme.onSurface,
    },
    subline: {
      fontSize: typography.sizes.sm,
      color: theme.onSurfaceVariant,
      lineHeight: 20,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: theme.secondary,
      borderRadius: borderRadius.md,
      padding: 4,
      gap: 4,
    },
    tab: {
      flex: 1,
      height: 40,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: { backgroundColor: theme.surface },
    tabText: {
      fontSize: typography.sizes.sm,
      color: theme.onSurfaceVariant,
      fontWeight: typography.weights.medium,
    },
    tabTextActive: {
      color: theme.onSurface,
      fontWeight: typography.weights.semibold,
    },
    tierList: { gap: spacing.md, marginTop: spacing.xs },
    tierCard: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      padding: spacing.md,
      gap: spacing.sm,
    },
    recommendBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.sm,
    },
    recommendBadgeText: {
      fontSize: 10,
      fontWeight: typography.weights.bold,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    tierHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    tierName: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.bold,
      color: theme.onSurface,
    },
    speedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    speedText: {
      fontSize: typography.sizes.xs,
      color: theme.onSurfaceVariant,
      fontWeight: typography.weights.medium,
    },
    priceCol: { alignItems: 'flex-end' },
    price: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.bold,
      color: theme.primary,
    },
    priceUnit: {
      fontSize: typography.sizes.xs,
      color: theme.onSurfaceVariant,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.outline,
    },
    featureList: { gap: 6 },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    featureText: {
      fontSize: typography.sizes.sm,
      color: theme.onSurface,
    },
    buyBtn: {
      height: 44,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
    buyBtnText: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    payBanner: {
      position: 'absolute',
      bottom: 16,
      left: spacing.md,
      right: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.outline,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
    },
    payIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    payLabel: {
      fontSize: typography.sizes.xs,
      color: theme.onSurfaceVariant,
    },
    payValue: {
      fontSize: typography.sizes.sm,
      color: theme.onSurface,
      fontWeight: typography.weights.semibold,
    },
  });

const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  payVia: { fontSize: 12 },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignSelf: 'stretch',
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 14, fontWeight: '600' },
});
