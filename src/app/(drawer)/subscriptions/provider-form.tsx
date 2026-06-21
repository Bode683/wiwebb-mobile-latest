import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, typography, spacing, borderRadius } from '../../../theme';
import {
  useGetPaymentProviderByIdQuery,
  useUpdatePaymentProviderMutation,
} from '../../../features/payment-providers/api/paymentProvidersApi';

// Human-readable labels for known config keys
const CONFIG_LABELS: Record<string, string> = {
  merchant_id:      'Merchant ID',
  api_key:          'API Key',
  environment:      'Environment (sandbox / production)',
  gateway:          'Gateway',
  publishable_key:  'Publishable Key',
};

export default function ProviderFormScreen() {
  const { t } = useTranslation('payment-providers');
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: provider, isLoading } = useGetPaymentProviderByIdQuery(id);
  const [updateProvider, { isLoading: saving }] = useUpdatePaymentProviderMutation();

  const [enabled, setEnabled] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!provider) return;
    setEnabled(provider.enabled);
    setConfig({ ...provider.config });
  }, [provider]);

  const handleSave = async () => {
    try {
      await updateProvider({ id, patch: { enabled, config } }).unwrap();
      router.back();
    } catch {
      Alert.alert(t('toggleError'));
    }
  };

  if (isLoading || !provider) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[typography.variants.titleMedium, { color: theme.onSurface, marginBottom: spacing.xs }]}>
        {provider.display_name}
      </Text>
      <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant, marginBottom: spacing.md }]}>
        {t('form.providerKey')}: {provider.provider}
      </Text>

      {/* Enable / disable toggle */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <View style={styles.switchRow}>
          <Text style={[typography.variants.labelLarge, { color: theme.onSurface }]}>
            {t('enabled')}
          </Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ true: theme.primary }}
          />
        </View>
      </View>

      {/* Config fields */}
      {Object.keys(config).length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
          <Text style={[typography.variants.labelMedium, { color: theme.onSurfaceVariant, marginBottom: spacing.sm }]}>
            {t('form.credentials')}
          </Text>
          {Object.entries(config).map(([key, value]) => (
            <View key={key} style={styles.fieldBlock}>
              <Text style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant }]}>
                {CONFIG_LABELS[key] ?? key}
              </Text>
              <TextInput
                value={value}
                onChangeText={(v) => setConfig((prev) => ({ ...prev, [key]: v }))}
                style={[
                  styles.input,
                  { backgroundColor: theme.background, borderColor: theme.outline, color: theme.onSurface },
                ]}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={key === 'api_key' || key === 'publishable_key'}
              />
            </View>
          ))}
        </View>
      )}

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={[styles.saveBtn, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}
      >
        {saving ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
            {t('form.save')}
          </Text>
        )}
      </Pressable>
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldBlock: { gap: 4 },
  input: {
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
  },
  saveBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
