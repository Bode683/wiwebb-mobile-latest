import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../../../../components/AppIcon';
import {
  addPaymentMethod,
  PaymentMethod,
  PaymentMethodType,
  removePaymentMethod,
  selectDefaultPaymentMethodId,
  selectPaymentMethods,
  setDefaultPaymentMethod,
} from '../../../../store/slices/paymentMethods';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { borderRadius, spacing, useTheme } from '../../../../theme';
import { typography } from '../../../../theme/typography';

const ORANGE_LOGO = require('../../../../assets/images/orangemoney.png');
const MTN_LOGO = require('../../../../assets/images/momo-logo.webp');
const CARD_LOGO = require('../../../../assets/images/mastercard.jpeg');

interface MethodMeta {
  brandColor: string;
  label: string;
  logo: any;
}

const METHOD_META: Record<PaymentMethodType, MethodMeta> = {
  'orange-money': { brandColor: '#FF6600', label: 'Orange Money', logo: ORANGE_LOGO },
  'mtn-momo':     { brandColor: '#FFCC00', label: 'MTN Mobile Money', logo: MTN_LOGO },
  card:           { brandColor: '#1F2937', label: 'Credit / Debit Card', logo: CARD_LOGO },
};

const maskCard = (n: string) => {
  const last4 = n.replace(/\s+/g, '').slice(-4);
  return `•••• •••• •••• ${last4}`;
};

const methodSubtitle = (m: PaymentMethod) => {
  if (m.type === 'card') return maskCard(m.cardNumber);
  return m.phone;
};

export default function PaymentMethodsScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const methods = useAppSelector(selectPaymentMethods);
  const defaultId = useAppSelector(selectDefaultPaymentMethodId);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [formType, setFormType] = useState<PaymentMethodType | null>(null);

  const handleDelete = (id: string) => {
    Alert.alert('Remove payment method?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch(removePaymentMethod(id)),
      },
    ]);
  };

  const s = styles(theme);

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={s.content}>
        {methods.length === 0 ? (
          <View style={s.emptyState}>
            <View style={[s.emptyIcon, { backgroundColor: theme.primaryContainer }]}>
              <AppIcon type="Feather" name="credit-card" symbol="creditcard" size={28} color={theme.primary} />
            </View>
            <Text style={[s.emptyTitle, { color: theme.onSurface }]}>No payment methods yet</Text>
            <Text style={[s.emptyHint, { color: theme.onSurfaceVariant }]}>
              Add Orange Money, MTN MoMo or a card to start accepting payments.
            </Text>
          </View>
        ) : (
          <View style={s.list}>
            {methods.map((m) => {
              const meta = METHOD_META[m.type];
              const isDefault = m.id === defaultId;
              return (
                <TouchableOpacity
                  key={m.id}
                  activeOpacity={0.8}
                  onPress={() => dispatch(setDefaultPaymentMethod(m.id))}
                  onLongPress={() => handleDelete(m.id)}
                  style={[s.row, { borderColor: theme.outline, backgroundColor: theme.surface }]}
                >
                  <View style={[s.logoWrap, { borderColor: theme.outline }]}>
                    <Image source={meta.logo} style={s.logo} resizeMode="contain" />
                  </View>
                  <View style={s.rowText}>
                    <View style={s.rowTitleLine}>
                      <Text style={[s.rowTitle, { color: theme.onSurface }]} numberOfLines={1}>
                        {meta.label}
                      </Text>
                      {isDefault && (
                        <View style={[s.defaultBadge, { backgroundColor: theme.primaryContainer }]}>
                          <Text style={[s.defaultBadgeText, { color: theme.onPrimaryContainer }]}>
                            Default
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[s.rowSubtitle, { color: theme.onSurfaceVariant }]} numberOfLines={1}>
                      {methodSubtitle(m)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(m.id)} hitSlop={10}>
                    <AppIcon type="Feather" name="trash-2" symbol="trash" size={18} color={theme.onSurfaceVariant} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setPickerVisible(true)}
          style={[s.addBtn, { backgroundColor: theme.primary }]}
        >
          <AppIcon type="Feather" name="plus" symbol="plus" size={18} color={theme.onPrimary} />
          <Text style={[s.addBtnLabel, { color: theme.onPrimary }]}>Add Payment Method</Text>
        </TouchableOpacity>

        <Text style={[s.hint, { color: theme.onSurfaceVariant }]}>
          Tap to set as default. Long-press or use the trash icon to remove.
        </Text>
      </ScrollView>

      <TypePickerSheet
        visible={pickerVisible && !formType}
        onClose={() => setPickerVisible(false)}
        onSelect={(t) => setFormType(t)}
      />

      <AddMethodFormSheet
        type={formType}
        onClose={() => {
          setFormType(null);
          setPickerVisible(false);
        }}
        onSubmit={(payload) => {
          dispatch(addPaymentMethod(payload));
          setFormType(null);
          setPickerVisible(false);
        }}
      />
    </View>
  );
}

interface TypePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: PaymentMethodType) => void;
}

function TypePickerSheet({ visible, onClose, onSelect }: TypePickerProps) {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  const options: PaymentMethodType[] = ['orange-money', 'mtn-momo', 'card'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={sheetStyles.backdrop} onPress={onClose} />
      <View style={[sheetStyles.sheet, { backgroundColor: theme.surface, paddingBottom: bottom + 24 }]}>
        <View style={[sheetStyles.handle, { backgroundColor: theme.outline }]} />
        <Text style={[sheetStyles.title, { color: theme.onSurface }]}>Choose payment type</Text>

        {options.map((type) => {
          const meta = METHOD_META[type];
          return (
            <TouchableOpacity
              key={type}
              activeOpacity={0.75}
              onPress={() => onSelect(type)}
              style={[sheetStyles.option, { borderColor: theme.outline }]}
            >
              <View style={[sheetStyles.optionLogo, { borderColor: theme.outline }]}>
                <Image source={meta.logo} style={sheetStyles.logoImg} resizeMode="contain" />
              </View>
              <Text style={[sheetStyles.optionLabel, { color: theme.onSurface }]}>{meta.label}</Text>
              <AppIcon type="Feather" name="chevron-right" symbol="chevron.right" size={18} color={theme.onSurfaceVariant} />
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}

interface AddFormProps {
  type: PaymentMethodType | null;
  onClose: () => void;
  onSubmit: (payload:
    | { type: 'orange-money' | 'mtn-momo'; phone: string }
    | { type: 'card'; cardNumber: string; expiry: string; cvv: string }
  ) => void;
}

function AddMethodFormSheet({ type, onClose, onSubmit }: AddFormProps) {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const visible = !!type;
  const meta = type ? METHOD_META[type] : null;

  const reset = () => {
    setPhone('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!type) return;
    if (type === 'card') {
      if (!cardNumber.trim() || !expiry.trim() || !cvv.trim()) return;
      onSubmit({ type: 'card', cardNumber: cardNumber.trim(), expiry: expiry.trim(), cvv: cvv.trim() });
    } else {
      if (!phone.trim()) return;
      onSubmit({ type, phone: phone.trim() });
    }
    reset();
  };

  const inputStyle = [
    sheetStyles.input,
    { color: theme.onSurface, borderColor: theme.outline, backgroundColor: theme.surfaceVariant },
  ];

  const canSubmit =
    type === 'card'
      ? cardNumber.trim() && expiry.trim() && cvv.trim()
      : !!phone.trim();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <Pressable style={sheetStyles.backdrop} onPress={handleClose} />
      <View style={[sheetStyles.sheet, { backgroundColor: theme.surface, paddingBottom: bottom + 24 }]}>
        <View style={[sheetStyles.handle, { backgroundColor: theme.outline }]} />

        {meta && (
          <View style={sheetStyles.formHeader}>
            <View style={[sheetStyles.optionLogo, { borderColor: theme.outline }]}>
              <Image source={meta.logo} style={sheetStyles.logoImg} resizeMode="contain" />
            </View>
            <Text style={[sheetStyles.title, { color: theme.onSurface, marginLeft: spacing.sm }]}>
              {meta.label}
            </Text>
          </View>
        )}

        {type === 'card' ? (
          <View style={sheetStyles.form}>
            <Text style={[sheetStyles.label, { color: theme.onSurface }]}>Card number</Text>
            <TextInput
              style={inputStyle}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={theme.onSurfaceVariant}
              keyboardType="number-pad"
              maxLength={19}
            />
            <View style={sheetStyles.twoCol}>
              <View style={sheetStyles.col}>
                <Text style={[sheetStyles.label, { color: theme.onSurface }]}>Expiry</Text>
                <TextInput
                  style={inputStyle}
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="MM/YY"
                  placeholderTextColor={theme.onSurfaceVariant}
                  maxLength={5}
                />
              </View>
              <View style={sheetStyles.col}>
                <Text style={[sheetStyles.label, { color: theme.onSurface }]}>CVV</Text>
                <TextInput
                  style={inputStyle}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  placeholderTextColor={theme.onSurfaceVariant}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={sheetStyles.form}>
            <Text style={[sheetStyles.label, { color: theme.onSurface }]}>Phone number</Text>
            <TextInput
              style={inputStyle}
              value={phone}
              onChangeText={setPhone}
              placeholder="+237 6XX XXX XXX"
              placeholderTextColor={theme.onSurfaceVariant}
              keyboardType="phone-pad"
            />
          </View>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
          style={({ pressed }) => [
            sheetStyles.submit,
            {
              backgroundColor: theme.primary,
              opacity: canSubmit ? (Platform.OS === 'ios' && pressed ? 0.8 : 1) : 0.4,
            },
          ]}
        >
          <Text style={[sheetStyles.submitText, { color: theme.onPrimary }]}>Save</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.surfaceVariant },
    content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
    list: { gap: spacing.sm },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
    },
    logoWrap: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: '#fff',
    },
    logo: { width: 32, height: 32 },
    rowText: { flex: 1, gap: 2 },
    rowTitleLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    rowTitle: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    rowSubtitle: { fontSize: typography.sizes.sm },
    defaultBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    defaultBadgeText: {
      fontSize: 10,
      fontWeight: typography.weights.semibold,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      gap: spacing.sm,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      marginTop: spacing.sm,
    },
    emptyHint: {
      fontSize: typography.sizes.sm,
      textAlign: 'center',
      maxWidth: 280,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      height: 52,
      borderRadius: borderRadius.md,
    },
    addBtnLabel: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    hint: {
      fontSize: typography.sizes.xs,
      textAlign: 'center',
    },
  });

const sheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  title: { fontSize: 16, fontWeight: '700' },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  logoImg: { width: 28, height: 28 },
  optionLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  form: { gap: 6, marginTop: 6 },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  twoCol: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  submit: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { fontSize: 15, fontWeight: '700' },
});
